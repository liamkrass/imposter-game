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

    const handleNameSubmit = () => {
        if (playerName.trim()) {
            if (playerName.trim().toLowerCase() === 'gus') setPlayerName('gus the pussy');
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

    // Save to Storage whenever state changes
    useEffect(() => {
        if (playerName) sessionStorage.setItem('imposter_name', playerName);
        if (roomCode) sessionStorage.setItem('imposter_room', roomCode);
    }, [playerName, roomCode]);

    useEffect(() => {
        // Hydrate from Storage on Mount
        const savedName = sessionStorage.getItem('imposter_name');
        const savedCode = sessionStorage.getItem('imposter_room');

        if (savedName) setPlayerName(savedName);
        if (savedCode) setRoomCode(savedCode);

        // If we have both, auto-join (to recover from refresh)
        if (savedName && savedCode && step === 'NAME') {
            // We need to wait for socket connection first, which is handled in the other useEffect.
            // checks step to avoid loop.
            setStep('MENU'); // Move past name input to show "Reconnecting..." intent
        }

        // Auto-join when code is 4 chars (for manual typing)
        if (roomCode.length === 4 && step === 'MENU') { // Only auto join if we are in menu
            // This logic is slightly redundant with the "GO" button but okay for UX
            // But we should be careful not to trigger it if we are just hydrating.
        }
    }, []);

    // --- CONNECTION & AUTO-JOIN LOGIC ---

    // 1. Connect on mount
    useEffect(() => {
        socket.connect();
        return () => {
            socket.off('room_update');
            socket.disconnect();
        };
    }, []);

    // 2. Monitor Connection State
    const [connected, setConnected] = useState(socket.connected);
    useEffect(() => {
        const onConnect = () => setConnected(true);
        const onDisconnect = () => setConnected(false);

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);

    // 3. Unified Auto-Join / Re-Join Logic
    // Triggers when:
    // a) Connected becomes true (Reconnection/Initial Connect)
    // b) RoomCode/PlayerName are populated (Hydration/Typing)
    useEffect(() => {
        if (connected && roomCode.length === 4 && playerName) {
            console.log("Auto-joining room:", roomCode);
            // We use the same join logic for fresh joins and reconnections
            socket.emit('join_room', { code: roomCode, playerName }, (response) => {
                if (response.success) {
                    setRoom(response.room);
                    // Only change step if we aren't already in the room UI
                    if (step !== 'ROOM') setStep('ROOM');
                    setError(''); // Clear errors
                } else {
                    // Only show error if we are actively trying to join from menu
                    if (step === 'MENU' || step === 'NAME') {
                        // Don't overwrite existing error if it's just a background reconnect attempt
                        // But if it's a refresh-recovery, we might want to know.
                        // For now, let's not block the UI with an error unless user is looking at it.
                        if (!room) setError(response.message || 'Rejoin failed');
                    }
                }
            });
        }
    }, [connected, roomCode, playerName]); // room is NOT a dependency to allow re-join updates 

    // 4. Room Update Listener
    useEffect(() => {
        socket.on('room_update', (updatedRoom) => {
            setRoom(updatedRoom);
        });
        return () => socket.off('room_update');
    }, []);

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
