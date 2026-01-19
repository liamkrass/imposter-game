import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

function ActiveLobbies() {
    const navigate = useNavigate();
    const [lobbies, setLobbies] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchLobbies = () => {
        if (!socket.connected) {
            socket.connect();
        }
        socket.emit('get_lobbies', (data) => {
            setLobbies(data || []);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchLobbies();
        const interval = setInterval(fetchLobbies, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
        );
    }

    if (lobbies.length === 0) {
        return (
            <div className="text-center py-6 text-gray-600 text-sm">
                <p>No active lobbies found.</p>
                <p className="text-xs mt-1">Create one or enter a code above!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 max-h-48 overflow-y-auto custom-scrollbar">
            {lobbies.map((lobby) => (
                <button
                    key={lobby.code}
                    onClick={() => navigate(`/room/${lobby.code}`)}
                    className="glass-card p-3 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all border border-white/5 hover:border-blue-500/30 group"
                >
                    <div className="flex items-center gap-3">
                        <span className="text-xl font-black font-mono text-white tracking-wider group-hover:text-blue-400 transition-colors">
                            {lobby.code}
                        </span>
                        <span className="text-gray-500 text-sm">
                            {lobby.hostName}'s Room
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600 bg-white/5 px-2 py-1 rounded-md">
                            {lobby.playerCount}/8
                        </span>
                        <span className="text-blue-400 font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                            JOIN →
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default ActiveLobbies;
