import React, { useState } from 'react';
import socket from '../socket';

function Lobby({ room, playerName, lastUpdate, onForceSync }) {
    const isHost = room.players.find(p => p.name === playerName)?.isHost;
    const [showSettings, setShowSettings] = useState(false);

    // Defaults for settings (in case server hasn't set them yet)
    const imposterCount = room.imposterCount ?? 1;
    const isPublic = room.public ?? true;

    const handleStart = () => {
        socket.emit('start_game', room.code);
    };

    const updateSettings = (newSettings) => {
        socket.emit('update_settings', { code: room.code, settings: newSettings });
    };

    const maxImposters = Math.max(1, Math.floor((room.players.length - 1) / 2));

    // Settings Modal
    const SettingsModal = () => {
        if (!showSettings) return null;
        return (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
                <div className="glass-card border border-gray-700 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
                    <button
                        onClick={() => setShowSettings(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                    <h3 className="text-xl font-bold text-white mb-6">Room Settings</h3>

                    {/* Imposter Count */}
                    <div className="mb-6">
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Imposters</label>
                        <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl">
                            <button
                                onClick={() => updateSettings({ imposterCount: Math.max(1, imposterCount - 1) })}
                                disabled={imposterCount <= 1}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold disabled:opacity-30"
                            >
                                -
                            </button>
                            <span className="flex-1 text-center text-2xl font-black text-white">{imposterCount}</span>
                            <button
                                onClick={() => updateSettings({ imposterCount: Math.min(maxImposters, imposterCount + 1) })}
                                disabled={imposterCount >= maxImposters}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold disabled:opacity-30"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Public Toggle */}
                    <div className="mb-6 bg-black/20 p-4 rounded-xl flex items-center justify-between">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">Public Lobby</span>
                        <button
                            onClick={() => updateSettings({ public: !isPublic })}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${isPublic ? 'bg-emerald-500' : 'bg-gray-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowSettings(false)}
                        className="w-full bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto animate-fade-in relative z-10">
            <SettingsModal />

            {/* Settings Button (Host Only) */}
            {isHost && (
                <button
                    onClick={() => setShowSettings(true)}
                    className="absolute top-0 right-0 p-2 text-white/50 hover:text-white transition-colors z-50"
                    title="Room Settings"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            )}

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
                {/* Settings Info Badge */}
                <div className="flex justify-center gap-2 mt-3">
                    <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-1 rounded-full border border-red-500/20">
                        {imposterCount} Imposter{imposterCount > 1 ? 's' : ''}
                    </span>
                    <span className={`text-[10px] px-2 py-1 rounded-full border ${isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
                        {isPublic ? 'Public' : 'Private'}
                    </span>
                </div>
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

        </div>
    );
}

export default Lobby;
