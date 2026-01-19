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
        // Auto-join when code is 4 chars
        if (roomCode.length === 4) {
            joinRoom();
        }
    }, [roomCode]);

    useEffect(() => {
        // Connect when entering online mode
        socket.connect();

        socket.on('room_update', (updatedRoom) => {
            setRoom(updatedRoom);
        });

        // Cleanup on unmount or exit
        return () => {
            socket.off('room_update');
            socket.disconnect();
        };
    }, []);

    const handleNameSubmit = () => {
        if (playerName.trim()) {
            // Easter Egg
            if (playerName.trim().toLowerCase() === 'gus') {
                setPlayerName('gus the pussy');
            }
            setStep('MENU');
        }
    };

    const createRoom = () => {
        socket.emit('create_room', playerName, (response) => {
            if (response.success) {
                setRoom(response.room);
                setRoomCode(response.code); // CRITICAL: Save code for auto-rejoin
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

    // --- RENDER HELPERS ---

    const renderBackground = () => (
        <>
            <div className="absolute top-10 left-10 -z-10 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob"></div>
            <div className="absolute bottom-10 right-10 -z-10 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20 animate-blob animation-delay-2000"></div>
        </>
    );

    const renderNameStep = () => (
        <div className="glass-card p-8 rounded-3xl w-full max-w-md flex flex-col gap-6 animate-fade-in text-center border border-white/10">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Who are you?
            </h2>
            <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="glass-input p-4 rounded-2xl font-bold text-center text-xl outline-none border border-white/5 focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                placeholder="Enter Nickname"
                maxLength={12}
                onKeyDown={(e) => e.key === 'Enter' && playerName.trim() && handleNameSubmit()}
            />
            <button
                onClick={handleNameSubmit}
                disabled={!playerName.trim()}
                className="w-full py-4 rounded-2xl font-black text-white text-lg bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-purple-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
                Continue
            </button>
            <button onClick={onExit} className="text-gray-500 hover:text-white text-sm font-medium transition-colors">
                Cancel
            </button>
        </div>
    );

    const renderMenuStep = () => (
        <div className="glass-card p-8 rounded-3xl w-full max-w-md flex flex-col gap-8 animate-fade-in relative overflow-hidden border border-white/10">
            <div className="text-center">
                <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Logged in as</p>
                <h2 className="text-2xl font-black text-white">{playerName}</h2>
            </div>

            <div className="flex flex-col gap-4">
                <button
                    onClick={createRoom}
                    className="group relative w-full py-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex flex-col items-center">
                        <span className="text-2xl font-black text-white">CREATE ROOM</span>
                        <span className="text-teal-100 text-xs font-medium uppercase tracking-wider">Host a new game</span>
                    </span>
                </button>

                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase">OR JOIN</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            className="flex-1 glass-input p-4 rounded-xl font-mono text-2xl font-black text-center uppercase tracking-[0.2em] outline-none border border-white/5 focus:border-purple-500/50 transition-all placeholder:text-gray-700 placeholder:normal-case placeholder:tracking-normal placeholder:text-base placeholder:font-sans"
                            placeholder="Enter Code"
                            maxLength={4}
                        />
                        <button
                            onClick={joinRoom}
                            disabled={roomCode.length !== 4}
                            className="bg-purple-600 hover:bg-purple-500 text-white font-bold px-6 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
                        >
                            GO
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-medium p-3 rounded-lg text-center animate-shake">
                        {error}
                    </div>
                )}
            </div>

            <button onClick={() => setStep('NAME')} className="text-center text-gray-500 hover:text-white text-sm font-medium transition-colors">
                Back to Name
            </button>
        </div>
    );

    // --- MAIN RENDER ---

    // Show connecting state if socket not connected
    const [connected, setConnected] = useState(socket.connected);

    useEffect(() => {
        const onConnect = () => {
            setConnected(true);
            // Attempt to rejoin if we were in a room
            if (roomCode && playerName) {
                console.log("Reconnecting... attempting to rejoin", roomCode);
                socket.emit('join_room', { code: roomCode, playerName }, (response) => {
                    if (response.success) {
                        setRoom(response.room);
                    } else {
                        // If room is gone or full, kick to menu
                        setStep('MENU');
                        setError('Connection lost. Please rejoin manually.');
                    }
                });
            }
        };
        const onDisconnect = () => setConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        // Initial check
        if (socket.connected) setConnected(true);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, [roomCode, playerName]);

    if (!connected && step !== 'NAME') {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center p-4 relative z-10">
                {renderBackground()}
                <div className="glass-card p-8 rounded-3xl flex flex-col items-center gap-4 animate-pulse">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    <h2 className="text-xl font-bold text-white">Connecting to Server...</h2>
                    <p className="text-sm text-gray-400">This may take up to a minute (waking up server)</p>
                    <button onClick={onExit} className="text-gray-500 hover:text-white text-sm mt-4">Cancel</button>
                </div>
            </div>
        );
    }

    if (step === 'ROOM' && room) {
        return (
            <div className="w-full max-w-md mx-auto p-4 md:p-0 animate-fade-in relative z-10 min-h-[60vh] flex flex-col justify-center">
                {/* Backgrounds */}
                {renderBackground()}

                <button
                    onClick={onExit}
                    className="absolute top-0 left-0 md:-left-12 p-2 text-gray-400 hover:text-white transition-colors z-50 bg-black/20 hover:bg-black/40 rounded-full backdrop-blur-md"
                    title="Leave Game"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                    </svg>
                </button>

                {room.gameState === 'LOBBY' && <Lobby room={room} playerName={playerName} />}
                {room.gameState === 'GAME' && <Game room={room} playerName={playerName} />}
                {room.gameState === 'VOTING' && <Voting room={room} playerName={playerName} />}
                {room.gameState === 'RESULTS' && <Results room={room} playerName={playerName} />}
            </div>
        );
    }

    return (
        <div className="min-h-[60vh] w-full flex items-center justify-center p-4 relative z-10">
            {renderBackground()}

            {step === 'NAME' && renderNameStep()}
            {step === 'MENU' && renderMenuStep()}
        </div>
    );
}

export default OnlineManager;
