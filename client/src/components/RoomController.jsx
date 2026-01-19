import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../socket';
import Lobby from './Lobby';
import Game from './Game';
import Voting from './Voting';
import Results from './Results';
import { useVersionCheck } from '../hooks/useVersionCheck';

function RoomController() {
    useVersionCheck(); // Will auto-reload if stale
    const { roomCode } = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [error, setError] = useState('');
    const [connected, setConnected] = useState(socket.connected);
    const [lastUpdate, setLastUpdate] = useState(Date.now()); // Debug: Track last update time

    // Get player name from storage (should be set in Home)
    const playerName = sessionStorage.getItem('imposter_name');

    // Redirect if no name (user tried to direct link without setting name)
    useEffect(() => {
        if (!playerName) {
            // Save attempted room to redirect back after name entry?
            // For now, simple redirect
            navigate('/');
        }
    }, [playerName, navigate]);

    // Connection & Join Logic
    useEffect(() => {
        if (!playerName) return;

        // Ensure connected
        if (!socket.connected) {
            socket.connect();
        }

        const onConnect = () => {
            setConnected(true);
            attemptJoin();
        };

        const onDisconnect = () => {
            setConnected(false);
        };

        const attemptJoin = () => {
            const code = roomCode.toUpperCase();
            console.log(`Attempting join room ${code} as ${playerName}`);
            socket.emit('join_room', { code, playerName }, (response) => {
                if (response.success) {
                    setRoom(response.room);
                    setError('');
                    // Also save room to session just in case, though URL is source of truth now
                    sessionStorage.setItem('imposter_room', code);
                } else {
                    setError(response.message || 'Failed to join room');
                }
            });
        };

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('room_update', (updatedRoom) => {
            console.log("Received room update:", updatedRoom);
            setRoom(updatedRoom);
            setLastUpdate(Date.now());
        });

        // Initial check if already connected
        if (socket.connected) {
            setConnected(true);
            attemptJoin(); // connection might be existing
        }

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
            socket.off('room_update');
            // Do NOT disconnect socket on unmount to allow navigation back to menu without reconnecting?
            // Actually, usually good to stay connected.
            // But if we leave RoomController, we probably mean to leave the room.
            // Let's rely on server 'disconnect' or explicit leave.
        };
    }, [roomCode, playerName]);

    const handleExit = () => {
        // Explicitly leave? Or just navigate away?
        // Socket.io doesn't have a standardized "leave room" without custom event or disconnect.
        // We can just disconnect to force leave, or emit a leave event if we had one.
        // For now, refreshing the page or navigating away is "leaving" in the UI sense.
        // If we want to really leave, we can reload to root?
        navigate('/');
        window.location.reload(); // Force socket disconnect/cleanup
    };

    const renderBackground = () => (
        <>
            <div className="absolute top-10 left-10 -z-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-10 right-10 -z-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        </>
    );

    if (error) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center p-4 relative z-10">
                {renderBackground()}
                <div className="glass-card p-8 rounded-3xl text-center border border-red-500/30">
                    <h2 className="text-2xl font-black text-red-400 mb-4">Error</h2>
                    <p className="text-white mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-all"
                    >
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    const [showRetry, setShowRetry] = useState(false);

    useEffect(() => {
        let timer;
        if (!room || !connected) {
            timer = setTimeout(() => {
                setShowRetry(true);
            }, 5000); // Show retry after 5s of stuck loading
        } else {
            setShowRetry(false);
        }
        return () => clearTimeout(timer);
    }, [room, connected]);

    const handleRetry = () => {
        setConnected(false);
        socket.disconnect();
        socket.connect();
        window.location.reload(); // Hard reload is safest for persistent socket issues
    };

    // Auto-Sync Polling (Self-healing for desyncs)
    useEffect(() => {
        if (!connected || !room) return;

        const interval = setInterval(() => {
            // Ask server for latest state to ensure we didn't miss a broadcast
            socket.emit('get_room', room.code);
        }, 3000); // Check every 3 seconds

        return () => clearInterval(interval);
    }, [connected, room]);

    if (!room || !connected) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center p-4 relative z-10">
                {renderBackground()}
                <div className="glass-card p-8 rounded-3xl flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <h2 className="text-xl font-bold text-white">Joining Room {roomCode}...</h2>
                    <p className="text-sm text-gray-400">Connecting to server</p>

                    {showRetry && (
                        <button
                            onClick={handleRetry}
                            className="mt-4 px-4 py-2 bg-yellow-600/20 text-yellow-500 border border-yellow-500/50 rounded-lg hover:bg-yellow-600/30 transition animate-fade-in font-bold text-sm"
                        >
                            Stuck? Tap to Retry
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-md mx-auto p-4 md:p-0 animate-fade-in relative z-10 min-h-[60vh] flex flex-col justify-center">
            {renderBackground()}
            <button
                onClick={handleExit}
                className="absolute top-0 left-0 md:-left-12 p-2 text-gray-400 hover:text-white transition-colors z-50 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md"
                title="Leave Game"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
            </button>
            {room.gameState === 'LOBBY' && <Lobby room={room} playerName={playerName} lastUpdate={lastUpdate} onForceSync={() => socket.emit('get_room', room.code)} />}
            {room.gameState === 'PLAYING' && <Game room={room} playerName={playerName} />}
            {room.gameState === 'VOTING' && <Voting room={room} playerName={playerName} />}
            {room.gameState === 'RESULTS' && <Results room={room} playerName={playerName} />}
        </div>
    );
}

export default RoomController;
