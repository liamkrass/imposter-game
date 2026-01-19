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
        if (room.gameState !== 'LOBBY') {
            return callback({ success: false, message: "Game already started" });
        }

        // Cancel pending deletion if room is being rejoined
        if (room.deleteTimeout) {
            clearTimeout(room.deleteTimeout);
            room.deleteTimeout = null;
            console.log(`Deletion cancelled for room ${code}`);
        }

        room.addPlayer(socket.id, playerName);
        socket.join(code);

        // Notify others
        io.to(code).emit('room_update', room);

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
                room.removePlayer(socket.id);
                room.removePlayer(socket.id);

                if (room.players.length === 0) {
                    // Grace Period: Don't delete immediately. Wait 60s.
                    // If someone joins back, cancel deletion.
                    console.log(`Room ${code} is empty. Scheduling deletion in 60s...`);

                    room.deleteTimeout = setTimeout(() => {
                        if (rooms.has(code) && rooms.get(code).players.length === 0) {
                            rooms.delete(code);
                            console.log(`Room ${code} deleted (inactive).`);
                        }
                    }, 60000); // 60 seconds grace period
                } else {
                    io.to(code).emit('room_update', room);
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

