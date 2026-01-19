import React from 'react';
import socket from '../socket';

function Lobby({ room, playerName }) {
    const isHost = room.players.find(p => p.name === playerName)?.isHost;

    const handleStart = () => {
        socket.emit('start_game', room.code);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto animate-fade-in relative z-10">
            {/* Header / Room Code */}
            <div className="glass-card w-full p-6 rounded-3xl text-center border border-white/10 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">ROOM CODE</p>
                <div className="relative inline-block">
                    <h2 className="text-6xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-lg">
                        {room.code}
                    </h2>
                    <div className="absolute -inset-4 bg-purple-500/20 filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full"></div>
                </div>
                <p className="text-gray-500 text-xs mt-2">Share this code with friends</p>
            </div>

            {/* Players List */}
            <div className="glass-card w-full p-6 rounded-3xl border border-white/10 flex flex-col gap-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-3">
                    <h3 className="text-white font-bold text-lg">Players</h3>
                    <span className="text-blue-400 font-mono text-sm bg-blue-500/10 px-2 py-1 rounded-md border border-blue-500/20">
                        {room.players.length} / 8
                    </span>
                </div>

                <ul className="flex flex-col gap-2 max-h-64 overflow-y-auto custom-scrollbar pr-1">
                    {room.players.map((p) => (
                        <li
                            key={p.id}
                            className={`flex justify-between items-center p-3 rounded-xl border transition-all ${p.name === playerName
                                ? "bg-white/10 border-blue-500/30"
                                : "bg-black/20 border-white/5"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${p.name === playerName ? "bg-gradient-to-br from-blue-500 to-purple-500 text-white" : "bg-gray-700 text-gray-400"
                                    }`}>
                                    {p.name.charAt(0).toUpperCase()}
                                </div>
                                <span className={p.name === playerName ? "text-white font-bold" : "text-gray-300 font-medium"}>
                                    {p.name} {p.name === playerName && <span className="text-xs text-blue-400 ml-1">(You)</span>}
                                </span>
                            </div>

                            {p.isHost && (
                                <span className="text-[10px] font-bold bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full border border-yellow-500/20 flex items-center gap-1 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                                    <span>👑</span> HOST
                                </span>
                            )}
                        </li>
                    ))}
                </ul>

                {room.players.length < 3 && (
                    <div className="text-center p-3 bg-yellow-500/5 rounded-xl border border-yellow-500/10">
                        <p className="text-yellow-200/80 text-xs">Need at least 3 players to start.</p>
                    </div>
                )}
            </div>

            {/* Start Button */}
            {isHost ? (
                <button
                    onClick={handleStart}
                    disabled={room.players.length < 3}
                    className={`w-full py-5 rounded-2xl font-black text-xl transition-all relative overflow-hidden group ${room.players.length >= 3
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-xl shadow-purple-500/30 hover:scale-[1.02] active:scale-95 text-white cursor-pointer'
                        : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                        }`}
                >
                    {room.players.length >= 3 && (
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {room.players.length < 3 ? "WAITING FOR PLAYERS..." : "START GAME"}
                    </span>
                </button>
            ) : (
                <div className="w-full py-4 text-center">
                    <div className="inline-flex items-center gap-2 text-gray-400 animate-pulse">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm font-medium tracking-wide">Waiting for host to start...</span>
                    </div>
                </div>
            )}
            {/* Debug Footer */}
            <div className="w-full text-center mt-8 pt-4 border-t border-white/5">
                <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    DEBUG: {socket.id ? socket.id.slice(0, 4) : 'DISC'} | {socket.connected ? 'CONN' : 'OFF'} | LATENCY: {socket.io?.engine?.transport?.name}
                </p>
            </div>
        </div>
    );
}

export default Lobby;
