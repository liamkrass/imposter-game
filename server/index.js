const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Room = require('./room');
const { getRandomWord } = require('./words');

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*", // Allow connections from Vercel
        methods: ["GET", "POST"]
    }
});

const rooms = new Map(); // code -> Room

// Helper to generate room code
function generateCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on('create_room', (playerName, callback) => {
        const code = generateCode();
        const room = new Room(code);
        rooms.set(code, room);

        room.addPlayer(socket.id, playerName);
        socket.join(code);

        callback({ success: true, code, room: room });
        console.log(`Room created: ${code} by ${playerName}`);
    });

    socket.on('join_room', ({ code, playerName }, callback) => {
        const room = rooms.get(code);
        if (!room) {
            return callback({ success: false, message: "Room not found" });
        }
        const existingPlayer = room.players.find(p => p.name.toUpperCase() === playerName.toUpperCase());

        if (room.gameState !== 'LOBBY' && !existingPlayer) {
            return callback({ success: false, message: "Game already started" });
        }

        // Cancel pending deletion if room is being rejoined
        if (room.deleteTimeout) {
            clearTimeout(room.deleteTimeout);
            room.deleteTimeout = null;
            console.log(`Deletion cancelled for room ${code}`);
        }

        const added = room.addPlayer(socket.id, playerName);
        if (!added) {
            return callback({ success: false, message: "Invalid Name" });
        }

        // Notify others
        socket.join(code);

        // Debug: Log room size
        const roomSize = io.sockets.adapter.rooms.get(code)?.size || 0;
        console.log(`Socket ${socket.id} joined room ${code}. Total sockets in room: ${roomSize}`);

        io.to(code).emit('room_update', room);
        console.log(`Broadcasted update to room ${code}. Players: ${room.players.map(p => p.name).join(', ')}`);

        callback({ success: true, room });
        console.log(`${playerName} joined ${code}`);
    });

    socket.on('start_game', (code) => {
        const room = rooms.get(code);
        if (room) {
            const { word, category, reset } = getRandomWord(room.usedWords);

            if (reset) {
                room.usedWords = [word];
            } else {
                room.usedWords.push(word);
            }

            if (room.startGame(word, category)) {
                io.to(code).emit('room_update', room);
            }
        }
    });

    socket.on('start_voting', (code) => {
        const room = rooms.get(code);
        if (room) {
            room.startVoting();
            io.to(code).emit('room_update', room);
        }
    });

    socket.on('vote', ({ code, voteId }) => {
        const room = rooms.get(code);
        if (room) {
            room.vote(socket.id, voteId);
            io.to(code).emit('room_update', room);
        }
    });

    // Version Check
    socket.on('get_version', (callback) => {
        // Current Server Version - Bump this manually when deploying breaking changes
        // Use '1.1' as the new baseline
        callback({ version: '1.1' });
    });

    // Manual Sync Enpoint
    socket.on('get_room', (code) => {
        const room = rooms.get(code);
        if (room) {
            console.log(`Socket ${socket.id} requested sync for room ${code}`);
            socket.emit('room_update', room); // Send only to requestor
        } else {
            console.log(`Socket ${socket.id} requested sync but room ${code} not found`);
        }
    });

    socket.on('reset_game', (code) => {
        const room = rooms.get(code);
        if (room) {
            room.resetGame();
            io.to(code).emit('room_update', room);
        }
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected', socket.id);
        // Find room user was in
        for (const [code, room] of rooms.entries()) {
            const player = room.getPlayer(socket.id);
            if (player) {
                // Soft Disconnect: Mark as offline but KEEP in room array
                const allOffline = room.disconnectPlayer(socket.id);

                io.to(code).emit('room_update', room);

                if (allOffline) {
                    // Start Grace Period ONLY if everyone is offline
                    console.log(`Room ${code} is effectively empty (all offline). Scheduling deletion in 60s...`);

                    room.deleteTimeout = setTimeout(() => {
                        // Double check if everyone is still offline
                        if (rooms.has(code)) {
                            const r = rooms.get(code);
                            if (r.players.every(p => !p.connected)) {
                                rooms.delete(code);
                                console.log(`Room ${code} deleted (inactive).`);
                            }
                        }
                    }, 60000); // 60 seconds grace period
                }
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

