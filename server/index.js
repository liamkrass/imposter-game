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
        origin: ["http://localhost:5173", "http://localhost:5174"],
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
            const { word, category } = getRandomWord();
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
                if (room.players.length === 0) {
                    rooms.delete(code);
                } else {
                    io.to(code).emit('room_update', room);
                }
                break;
            }
        }
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
});

