import React, { useState, useEffect } from 'react';
import socket from '../socket';
import Lobby from './Lobby';
import Game from './Game';
import Voting from './Voting';
import Results from './Results';

function OnlineManager({ onExit }) {
    const [step, setStep] = useState('NAME'); // NAME, MENU, JOIN, ROOM
    const [playerName, setPlayerName] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [room, setRoom] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        socket.on('room_update', (updatedRoom) => {
            setRoom(updatedRoom);
        });

        return () => {
            socket.off('room_update');
        };
    }, []);

    const handleNameSubmit = () => {
        if (playerName.trim()) {
            setStep('MENU');
        }
    };

    const createRoom = () => {
        socket.emit('create_room', playerName, (response) => {
            if (response.success) {
                setRoom(response.room);
                setStep('ROOM');
            } else {
                setError('Failed to create room');
            }
        });
    };

    const joinRoom = () => {
        if (roomCode.length !== 4) return;
        socket.emit('join_room', { code: roomCode.toUpperCase(), playerName }, (response) => {
            if (response.success) {
                setRoom(response.room);
                setStep('ROOM');
            } else {
                setError(response.message || 'Failed to join');
            }
        });
    };

    // Render Logic
    if (step === 'NAME') {
        return (
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-6 animate-fade-in relative z-10 text-center min-h-[50vh] justify-center">
                <h2 className="text-3xl font-black text-white">Enter Name</h2>
                <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="glass-input p-4 rounded-xl font-bold text-center outline-none"
                    placeholder="Your Name"
                    maxLength={12}
                />
                <button
                    onClick={handleNameSubmit}
                    disabled={!playerName.trim()}
                    className="bg-white text-dark font-bold py-4 rounded-xl disabled:opacity-50"
                >
                    Continue
                </button>
                <button onClick={onExit} className="text-gray-500 hover:text-white">Back</button>
            </div>
        );
    }

    if (step === 'MENU') {
        return (
            <div className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 animate-fade-in relative z-10 text-center min-h-[50vh] justify-center">
                <h2 className="text-2xl font-bold text-white mb-4">Welcome, {playerName}</h2>
                <button
                    onClick={createRoom}
                    className="glass-card hover:bg-white/10 p-6 rounded-2xl border border-white/10 flex flex-col items-center gap-2 group transition-all"
                >
                    <span className="text-3xl group-hover:scale-110 transition-transform">🆕</span>
                    <span className="font-bold text-lg">Create Room</span>
                </button>

                <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
                    <span className="font-bold text-lg">Join Room</span>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="glass-input flex-1 p-3 rounded-xl font-bold text-center uppercase tracking-widest outline-none"
                            placeholder="CODE"
                            maxLength={4}
                        />
                        <button
                            onClick={joinRoom}
                            disabled={roomCode.length !== 4}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 rounded-xl disabled:opacity-50"
                        >
                            GO
                        </button>
                    </div>
                    {error && <p className="text-red-400 text-sm font-bold">{error}</p>}
                </div>
                <button onClick={() => setStep('NAME')} className="text-gray-500 hover:text-white mt-4">Back</button>
            </div>
        );
    }

    if (step === 'ROOM' && room) {
        // Game State Switcher
        return (
            <div className="w-full max-w-md mx-auto p-4 animate-fade-in relative z-10 min-h-[80vh] flex flex-col justify-center">
                <button onClick={onExit} className="absolute top-4 left-4 text-gray-500 hover:text-white z-50">Exit</button>

                {room.gameState === 'LOBBY' && <Lobby room={room} playerName={playerName} />}
                {room.gameState === 'GAME' && <Game room={room} playerName={playerName} />}
                {room.gameState === 'VOTING' && <Voting room={room} playerName={playerName} />}
                {room.gameState === 'RESULTS' && <Results room={room} playerName={playerName} />}
            </div>
        );
    }

    return null;
}

export default OnlineManager;
