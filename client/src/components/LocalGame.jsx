import React, { useState } from 'react';
import { getRandomWord } from '../words';

function LocalGame({ onExit }) {
    // Game Configuration
    const [players, setPlayers] = useState([]);
    const [inputValue, setInputValue] = useState('');

    // Game State
    const [gameState, setGameState] = useState('SETUP'); // SETUP, HUB, REVEAL_MODAL, PLAYING, END
    const [secretWord, setSecretWord] = useState('');
    const [category, setCategory] = useState('');
    const [imposterIndex, setImposterIndex] = useState(null);

    // Hub State
    const [seenPlayers, setSeenPlayers] = useState(new Set()); // Set of indices
    const [viewingPlayerIndex, setViewingPlayerIndex] = useState(null); // Current player peeking
    const [isRevealed, setIsRevealed] = useState(false); // Card flipped?

    const addPlayer = () => {
        if (inputValue.trim()) {
            setPlayers([...players, inputValue.trim()]);
            setInputValue('');
        }
    };

    const startGame = () => {
        if (players.length < 3) return;
        const { word, category } = getRandomWord();
        setSecretWord(word);
        setCategory(category);
        setImposterIndex(Math.floor(Math.random() * players.length));
        setGameState('HUB');
        setSeenPlayers(new Set());
    };

    const handlePlayerTap = (index) => {
        setViewingPlayerIndex(index);
        setGameState('REVEAL_MODAL');
        setIsRevealed(false);
    };

    const closeReveal = () => {
        const newSeen = new Set(seenPlayers);
        newSeen.add(viewingPlayerIndex);
        setSeenPlayers(newSeen);
        setViewingPlayerIndex(null);
        setGameState('HUB');
    };

    const startPlaying = () => {
        setGameState('PLAYING');
    };

    const revealImposter = () => {
        setGameState('END');
    };

    const BackgroundBlobs = () => (
        <>
            <div className="fixed top-0 left-0 -z-10 w-80 h-80 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none"></div>
            <div className="fixed top-0 right-0 -z-10 w-80 h-80 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="fixed -bottom-32 left-20 -z-10 w-80 h-80 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>
        </>
    );

    // --- RENDERERS ---

    if (gameState === 'SETUP') {
        return (
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-6 animate-fade-in relative z-10 text-center min-h-[60vh] justify-center">
                <BackgroundBlobs />
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    Local Party
                </h2>
                <p className="text-blue-200/60 font-medium tracking-wide text-sm">Add at least 3 players to start</p>

                <div className="glass-card rounded-3xl p-6 flex flex-col gap-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Player Name"
                            className="glass-input flex-1 p-3 rounded-xl font-bold outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                        />
                        <button onClick={addPlayer} className="bg-white/10 text-white hover:bg-white/20 w-12 rounded-xl font-bold border border-white/10 transition pb-1 text-2xl">
                            +
                        </button>
                    </div>

                    <ul className="flex flex-wrap gap-2 justify-center min-h-[50px]">
                        {players.map((p, i) => (
                            <li key={i} className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full text-white font-bold border border-white/10 flex items-center gap-2 animate-pop-in">
                                {p}
                                <button
                                    onClick={() => setPlayers(players.filter((_, idx) => idx !== i))}
                                    className="text-red-400 hover:text-red-300 ml-1"
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                        {players.length === 0 && <span className="text-gray-500 text-sm italic py-2">No players added yet</span>}
                    </ul>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={startGame}
                        disabled={players.length < 3}
                        className={`w-full py-4 font-bold text-lg rounded-2xl transition-all shadow-lg border border-transparent ${players.length >= 3
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-teal-500/30 hover:scale-[1.02] active:scale-95 border-teal-400/30'
                                : 'bg-white/5 text-gray-500 cursor-not-allowed border-white/5'
                            }`}
                    >
                        Start Game
                    </button>
                    <button onClick={onExit} className="text-gray-500 hover:text-white font-medium transition">
                        Back to Menu
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'HUB') {
        const allSeen = seenPlayers.size === players.length;

        return (
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-6 animate-fade-in relative z-10 text-center">
                <BackgroundBlobs />
                <h2 className="text-3xl font-black text-white">Tap Your Name</h2>
                <p className="text-gray-400 font-medium mb-2">Check your secret role, then pass back.</p>

                <div className="grid grid-cols-2 gap-4 w-full">
                    {players.map((p, i) => {
                        const seen = seenPlayers.has(i);
                        return (
                            <button
                                key={i}
                                onClick={() => handlePlayerTap(i)}
                                className={`p-6 rounded-2xl relative overflow-hidden transition-all shadow-lg border ${seen
                                        ? 'bg-white/5 border-white/5 text-gray-500'
                                        : 'glass-button hover:border-blue-400/50 hover:shadow-blue-500/20 text-xl font-black'
                                    }`}
                            >
                                {p}
                                {seen && <span className="absolute top-2 right-2 text-emerald-400 text-lg">✓</span>}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-8 w-full">
                    <p className="text-gray-500 text-sm font-medium mb-3">
                        {allSeen ? "Everyone is ready!" : `Waiting for ${players.length - seenPlayers.size} players...`}
                    </p>
                    <button
                        onClick={startPlaying}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg border border-transparent ${allSeen
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/40 animate-pulse hover:scale-[1.02] border-emerald-400/30'
                                : 'bg-white/5 text-gray-600 border-white/5'
                            }`}
                    >
                        Start Voting Phase
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'REVEAL_MODAL') {
        const isImposter = viewingPlayerIndex === imposterIndex;
        const name = players[viewingPlayerIndex];

        return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-fade-in">
                <BackgroundBlobs />
                <h3 className="text-gray-400 mb-8 uppercase tracking-widest text-sm font-bold">Pass device to <span className="text-white text-lg block mt-1">{name}</span></h3>

                <div
                    onClick={() => setIsRevealed(true)}
                    className={`w-72 h-96 cursor-pointer perspective-1000 transition-all duration-300 ${!isRevealed ? 'hover:scale-105' : ''}`}
                >
                    {!isRevealed ? (
                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl border border-white/10 flex flex-col items-center justify-center shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <span className="text-6xl mb-4 text-white/50">🔒</span>
                            <h2 className="text-2xl font-bold text-white">Tap to Reveal</h2>
                        </div>
                    ) : (
                        <div className={`w-full h-full rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center shadow-2xl animate-flip-in bg-black/40 backdrop-blur-md ${isImposter ? 'border-red-500 shadow-red-500/20' : 'border-emerald-500 shadow-emerald-500/20'
                            }`}>
                            {isImposter ? (
                                <>
                                    <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-red-500 to-pink-600 tracking-widest mb-6 drop-shadow-sm">IMPOSTER</h1>
                                    <div className="bg-red-500/10 p-4 rounded-2xl mb-6 w-full border border-red-500/30">
                                        <p className="text-red-400 text-xs uppercase font-black tracking-widest mb-1">Category</p>
                                        <p className="text-white font-bold text-2xl">{category}</p>
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium">Blend in. Don't get caught.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-emerald-500 text-xs uppercase font-black tracking-widest mb-2">Secret Word</p>
                                    <h1 className="text-5xl font-black text-white tracking-tight mb-8 drop-shadow-lg">{secretWord}</h1>
                                    <div className="bg-emerald-500/10 p-4 rounded-2xl w-full border border-emerald-500/30">
                                        <p className="text-emerald-500 text-xs uppercase font-black tracking-widest mb-1">Category</p>
                                        <p className="text-white font-bold text-2xl">{category}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {isRevealed && (
                    <button
                        onClick={closeReveal}
                        className="mt-8 bg-white text-black font-bold py-4 px-12 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Got it!
                    </button>
                )}
            </div>
        );
    }

    if (gameState === 'PLAYING') {
        return (
            <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto p-6 animate-fade-in text-center relative z-10">
                <BackgroundBlobs />
                <h2 className="text-4xl font-black text-white mb-2">Discuss & Vote</h2>
                <div className="glass-card px-8 py-3 rounded-full border border-white/10 shadow-lg">
                    <p className="text-gray-300 font-medium">Category: <span className="text-blue-400 font-bold uppercase">{category}</span></p>
                </div>

                <div className="w-full glass-card p-6 rounded-3xl border border-white/5">
                    <p className="text-sm text-gray-500 font-medium uppercase tracking-widest mb-4">Talking Phase</p>
                    <div className="flex justify-center items-center h-20">
                        <div className="animate-bounce text-4xl">🗣️</div>
                    </div>
                </div>

                <div className="mt-4">
                    <button
                        onClick={revealImposter}
                        className="bg-gradient-to-r from-red-600 to-pink-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-red-500/30 transition transform hover:scale-105 active:scale-95 border border-red-500/30"
                    >
                        Reveal Imposter
                    </button>
                </div>
            </div>
        );
    }

    if (gameState === 'END') {
        const imposterName = players[imposterIndex];
        return (
            <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-6 animate-pop-in text-center relative z-10">
                <BackgroundBlobs />
                <div className="animate-bounce">
                    <span className="text-8xl drop-shadow-2xl">🕵️‍♀️</span>
                </div>
                <div>
                    <h2 className="text-xl text-gray-500 font-bold uppercase tracking-widest mb-2">The Imposter was</h2>
                    <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-600 drop-shadow-sm">{imposterName}</h1>
                </div>

                <div className="glass-card p-8 rounded-3xl w-full mt-4 border border-emerald-500/20 bg-emerald-900/10">
                    <p className="text-xs text-emerald-500 font-black uppercase tracking-widest mb-2">Secret Word</p>
                    <p className="text-4xl font-black text-white">{secretWord}</p>
                </div>

                <div className="flex gap-4 w-full mt-4">
                    <button
                        onClick={startGame}
                        className="flex-1 bg-white text-black font-bold p-4 rounded-2xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                    >
                        Play Again
                    </button>
                    <button
                        onClick={onExit}
                        className="flex-1 glass-button font-bold p-4 rounded-2xl hover:bg-white/10"
                    >
                        Exit
                    </button>
                </div>
            </div>
        );
    }

    return null;
}

export default LocalGame;
