import React from 'react';
import socket from '../socket';

function Lobby({ room, playerName }) {
    const isHost = room.players.find(p => p.name === playerName)?.isHost;

    const handleStart = () => {
        socket.emit('start_game', room.code);
    };

    return (
        <div className="flex flex-col items-center gap-6">
            <div className="text-center">
                <p className="text-gray-400 text-sm">ROOM CODE</p>
                <h2 className="text-5xl font-mono font-bold tracking-widest text-secondary mt-1">
                    {room.code}
                </h2>
            </div>

            <div className="w-full bg-dark/50 rounded-lg p-4 max-h-60 overflow-y-auto">
                <h3 className="text-gray-400 text-xs uppercase mb-3 font-bold tracking-wider">Players ({room.players.length})</h3>
                <ul className="flex flex-col gap-2">
                    {room.players.map((p) => (
                        <li key={p.id} className="flex justify-between items-center bg-dark-lighter p-2 rounded border border-gray-700">
                            <span className={p.name === playerName ? "text-primary font-bold" : "text-gray-300"}>
                                {p.name} {p.name === playerName && "(You)"}
                            </span>
                            {p.isHost && <span className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded">HOST</span>}
                        </li>
                    ))}
                </ul>
            </div>

            {isHost ? (
                <button
                    onClick={handleStart}
                    disabled={room.players.length < 3}
                    className={`w-full p-4 rounded-xl font-bold text-lg transition shadow-lg ${room.players.length >= 3
                            ? 'bg-gradient-to-r from-primary to-purple-600 hover:scale-105 shadow-purple-900/50'
                            : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    {room.players.length < 3 ? "Need 3 Players" : "Start Game"}
                </button>
            ) : (
                <p className="text-gray-400 animate-pulse">Waiting for host to start...</p>
            )}
        </div>
    );
}

export default Lobby;
