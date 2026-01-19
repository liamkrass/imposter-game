import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import ActiveLobbies from './ActiveLobbies';

function Home() {
    const navigate = useNavigate();
    const [step, setStep] = useState('NAME'); // NAME, MENU
    const [playerName, setPlayerName] = useState('');
    const [roomCodeInput, setRoomCodeInput] = useState('');
    const [error, setError] = useState('');
    const [isCreating, setIsCreating] = useState(false); // Loading state for Create Room

    useEffect(() => {
        // Hydrate Name
        const savedName = sessionStorage.getItem('imposter_name');
        if (savedName) {
            setPlayerName(savedName);
            setStep('MENU');
        }
    }, []);

    useEffect(() => {
        if (playerName) sessionStorage.setItem('imposter_name', playerName);
    }, [playerName]);

    const handleNameSubmit = () => {
        if (playerName.trim()) {
            if (playerName.trim().toLowerCase() === 'gus') {
                setPlayerName('gus the pussy');
            }
            setStep('MENU');
        }
    };

    const createRoom = () => {
        setIsCreating(true);
        setError('');
        socket.connect(); // Ensure connection
        socket.emit('create_room', playerName, (response) => {
            setIsCreating(false);
            if (response.success) {
                // Navigate to room (RoomController will handle the rest)
                navigate(`/room/${response.code}`);
            } else {
                setError('Failed to create room. Try again.');
            }
        });

        // Timeout fallback for cold starts
        setTimeout(() => {
            if (isCreating) {
                setError('Server is waking up... Try again in a moment.');
                setIsCreating(false);
            }
        }, 8000);
    };

    // Auto-navigate when code is 4 chars
    useEffect(() => {
        if (roomCodeInput.length === 4) {
            navigate(`/room/${roomCodeInput.toUpperCase()}`);
        }
    }, [roomCodeInput, navigate]);

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
                    disabled={isCreating}
                    className={`group relative w-full py-6 rounded-2xl shadow-lg shadow-teal-500/20 transition-all overflow-hidden ${isCreating ? 'bg-gray-700 cursor-wait' : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:scale-[1.02] active:scale-95'}`}
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative z-10 flex flex-col items-center">
                        {isCreating ? (
                            <>
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mb-1"></div>
                                <span className="text-white text-sm font-medium">Connecting...</span>
                            </>
                        ) : (
                            <>
                                <span className="text-2xl font-black text-white">CREATE ROOM</span>
                                <span className="text-teal-100 text-xs font-medium uppercase tracking-wider">Host a new game</span>
                            </>
                        )}
                    </span>
                </button>

                <div className="relative flex items-center gap-4 py-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase">OR JOIN</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        type="text"
                        value={roomCodeInput}
                        onChange={(e) => setRoomCodeInput(e.target.value.toUpperCase())}
                        className="w-full glass-input p-4 rounded-xl font-mono text-2xl font-black text-center uppercase tracking-[0.2em] outline-none border border-white/5 focus:border-purple-500/50 transition-all placeholder:text-gray-700 placeholder:normal-case placeholder:tracking-normal placeholder:text-base placeholder:font-sans"
                        placeholder="ENTER 4-LETTER CODE"
                        maxLength={4}
                    />
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm font-medium p-3 rounded-lg text-center animate-shake">
                        {error}
                    </div>
                )}

                {/* Active Lobbies Section */}
                <div className="relative flex items-center gap-4 py-2 mt-2">
                    <div className="h-px bg-white/10 flex-1"></div>
                    <span className="text-gray-500 text-xs font-bold uppercase">ACTIVE LOBBIES</span>
                    <div className="h-px bg-white/10 flex-1"></div>
                </div>
                <ActiveLobbies />
            </div>

            <button onClick={() => setStep('NAME')} className="text-center text-gray-500 hover:text-white text-sm font-medium transition-colors">
                Change Name
            </button>
        </div>
    );

    return (
        <div className="min-h-[60vh] w-full flex items-center justify-center p-4 relative z-10">
            {renderBackground()}
            {step === 'NAME' && renderNameStep()}
            {step === 'MENU' && renderMenuStep()}
        </div>
    );
}

export default Home;
