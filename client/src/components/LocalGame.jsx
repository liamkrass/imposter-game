import React, { useState } from 'react';
import { getRandomWord, wordList } from '../words';

function LocalGame({ onExit }) {
    // Game Configuration
    const [players, setPlayers] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [selectedCategories, setSelectedCategories] = useState(wordList.map(c => c.category));
    const [imposterCount, setImposterCount] = useState(1);
    const [chaosMode, setChaosMode] = useState(false);
    const [chaosMode, setChaosMode] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);

    // Custom Category State
    const [customWordsList, setCustomWordsList] = useState([]);
    const [isEditingCustom, setIsEditingCustom] = useState(false);
    const [customInput, setCustomInput] = useState('');

    // Scoring State
    const [scores, setScores] = useState({}); // { "Liam": 5, "Bob": 2 }
    const [votingSelection, setVotingSelection] = useState(null); // Index of player voted for

    // Game State
    const [gameState, setGameState] = useState('SETUP'); // SETUP, HUB, REVEAL_MODAL, ACTION, END
    const [secretWord, setSecretWord] = useState('');
    const [category, setCategory] = useState('');
    const [imposterIndices, setImposterIndices] = useState([]);
    const [startPlayerIndex, setStartPlayerIndex] = useState(null);

    // Hub State
    const [seenPlayers, setSeenPlayers] = useState(new Set()); // Set of indices
    const [viewingPlayerIndex, setViewingPlayerIndex] = useState(null); // Current player peeking
    const [isRevealed, setIsRevealed] = useState(false); // Card flipped?

    const addPlayer = () => {
        if (inputValue.trim()) {
            let name = inputValue.trim();
            if (name.toLowerCase() === 'gus') {
                name = 'gus the pussy';
            }
            setPlayers([...players, name]);
            setInputValue('');
        }
    };

    const toggleCategory = (cat) => {
        if (selectedCategories.includes(cat)) {
            setSelectedCategories(selectedCategories.filter(c => c !== cat));
        } else {
            setSelectedCategories([...selectedCategories, cat]);
        }
    };

    const saveCustomWords = () => {
        const words = customInput.split(/[\n,]+/).map(w => w.trim()).filter(w => w.length > 0);
        if (words.length > 0) {
            setCustomWordsList(words);
            // Auto-select Custom category if not selected
            if (!selectedCategories.includes('Custom')) {
                setSelectedCategories([...selectedCategories, 'Custom']);
            }
        } else {
            // If cleared, remove Custom category
            if (selectedCategories.includes('Custom')) {
                setSelectedCategories(selectedCategories.filter(c => c !== 'Custom'));
            }
            setCustomWordsList([]);
        }
        setIsEditingCustom(false);
    };

    const openCustomEditor = () => {
        setCustomInput(customWordsList.join('\n'));
        setIsEditingCustom(true);
        setShowSettings(false); // Close settings if open
    };

    const startGame = () => {
        if (players.length < 3 || selectedCategories.length === 0) return;

        // Pass customWordsList to getRandomWord
        const { word, category } = getRandomWord(selectedCategories, customWordsList);

        setSecretWord(word);
        setCategory(category);

        // Select unique multiple imposters
        const indices = new Set();
        let targetImposters = imposterCount;

        if (chaosMode) {
            const roll = Math.random() * 100;
            if (roll < 90) {
                targetImposters = 1;
            } else if (roll < 99) {
                targetImposters = players.length > 8 ? 3 : 2;
            } else {
                targetImposters = players.length;
            }
        }

        const safeCount = chaosMode && targetImposters === players.length
            ? players.length
            : Math.min(targetImposters, Math.max(1, players.length - 1));

        while (indices.size < safeCount) {
            indices.add(Math.floor(Math.random() * players.length));
        }
        setImposterIndices(Array.from(indices));

        setStartPlayerIndex(Math.floor(Math.random() * players.length));
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

    const startActionPhase = () => {
        setVotingSelection(null);
        setGameState('ACTION');
    };

    const submitVote = () => {
        if (votingSelection === null) return;

        const votedPlayerIsImposter = imposterIndices.includes(votingSelection);

        // Scoring Logic
        const newScores = { ...scores };

        // Initialize scores for current players if missing
        players.forEach(p => {
            if (newScores[p] === undefined) newScores[p] = 0;
        });

        if (votedPlayerIsImposter) {
            // CIVILIANS WIN: +1 to all civilians
            // (Imposters get 0)
            players.forEach((p, index) => {
                if (!imposterIndices.includes(index)) {
                    newScores[p] = (newScores[p] || 0) + 1;
                }
            });
        } else {
            // IMPOSTERS WIN: +3 to all imposters
            // (Civilians get 0)
            imposterIndices.forEach(index => {
                const impName = players[index];
                newScores[impName] = (newScores[impName] || 0) + 3;
            });
        }

        setScores(newScores);
        setGameState('END');
    };

    // Calculate max imposters allowed based on player count
    const maxImposters = Math.max(1, Math.floor((players.length - 1) / 2));

    const BackgroundBlobs = () => (
        <>
            <div className="fixed top-0 left-0 -z-10 w-80 h-80 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob pointer-events-none"></div>
            <div className="fixed top-0 right-0 -z-10 w-80 h-80 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000 pointer-events-none"></div>
            <div className="fixed -bottom-32 left-20 -z-10 w-80 h-80 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000 pointer-events-none"></div>
        </>
    );

    const CustomEditorModal = () => {
        if (!isEditingCustom) return null;
        return (
            <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-dark-lighter border border-gray-700 p-6 rounded-3xl w-full max-w-md shadow-2xl relative flex flex-col h-[70vh]">
                    <button
                        onClick={() => setIsEditingCustom(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                    <h3 className="text-xl font-bold text-white mb-2">Custom Words</h3>
                    <p className="text-gray-400 text-sm mb-4">Enter words separated by newlines or commas.</p>

                    <textarea
                        className="flex-1 glass-input p-4 rounded-xl font-medium resize-none outline-none text-white/90 leading-relaxed"
                        placeholder="Lion&#10;Pizza&#10;Spaceship&#10;..."
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                    />

                    <button
                        onClick={saveCustomWords}
                        className="w-full mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-xl hover:scale-[1.02] transition shadow-lg shadow-blue-500/20"
                    >
                        Save & Use
                    </button>
                </div>
            </div>
        );
    };

    const SettingsModal = () => {
        if (!showSettings) return null;
        return (
            <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-dark-lighter border border-gray-700 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
                    <button
                        onClick={() => setShowSettings(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                    <h3 className="text-xl font-bold text-white mb-6">Game Settings</h3>

                    {/* Chaos Mode Toggle */}
                    <div className="mb-6 bg-black/20 p-4 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-red-400 font-bold uppercase tracking-wider text-sm">Chaos Mode</span>
                            <div className="relative group">
                                <span className="text-gray-400 cursor-help text-xs border border-gray-600 rounded-full w-4 h-4 flex items-center justify-center">i</span>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-48 bg-gray-800 text-xs text-gray-300 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    90% One Imposter<br />
                                    9% Two Imposters<br />
                                    1% Everyone is Imposter!
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setChaosMode(!chaosMode)}
                            className={`w-12 h-6 rounded-full p-1 transition-colors ${chaosMode ? 'bg-red-500' : 'bg-gray-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${chaosMode ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    {/* Imposter Count Setting */}
                    <div className={`mb-6 transition-opacity ${chaosMode ? 'opacity-30 pointer-events-none' : ''}`}>
                        <label className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 block">Imposters</label>
                        <div className="flex items-center gap-4 bg-black/20 p-2 rounded-xl">
                            <button
                                onClick={() => setImposterCount(Math.max(1, imposterCount - 1))}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold"
                            >
                                -
                            </button>
                            <span className="flex-1 text-center text-2xl font-black text-white">{chaosMode ? '?' : imposterCount}</span>
                            <button
                                onClick={() => setImposterCount(imposterCount + 1)}
                                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl font-bold"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Categories Setting */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Categories</span>
                            <button onClick={openCustomEditor} className="text-blue-400 text-xs font-bold hover:text-blue-300">+ Edit Custom</button>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                            {wordList.map((c) => {
                                const isSelected = selectedCategories.includes(c.category);
                                return (
                                    <button
                                        key={c.category}
                                        onClick={() => toggleCategory(c.category)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected
                                            ? 'bg-blue-500 text-white border-blue-400'
                                            : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        {c.category}
                                    </button>
                                );
                            })}
                            {/* Custom Category Button */}
                            <button
                                onClick={() => customWordsList.length > 0 ? toggleCategory('Custom') : openCustomEditor()}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${selectedCategories.includes('Custom')
                                    ? 'bg-purple-600 text-white border-purple-500 shadow-[0_0_10px_rgba(147,51,234,0.5)]'
                                    : 'bg-white/5 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'
                                    }`}
                            >
                                Custom {customWordsList.length > 0 && `(${customWordsList.length})`}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowSettings(false)}
                        className="w-full mt-8 bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition"
                    >
                        Done
                    </button>
                </div>
            </div>
        );
    };

    const GearIcon = () => (
        <button
            onClick={() => setShowSettings(true)}
            className="absolute top-6 right-6 z-40 text-white/50 hover:text-white transition-colors p-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            </svg>
        </button>
    );

    const TrophyIcon = () => (
        <button
            onClick={() => setShowLeaderboard(true)}
            className="absolute top-6 left-6 z-40 text-white/50 hover:text-yellow-400 transition-colors p-2"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                <path d="M4 22h16"></path>
                <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
            </svg>
        </button>
    );

    const LeaderboardModal = () => {
        if (!showLeaderboard) return null;
        return (
            <div className="fixed inset-0 z-[70] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
                <div className="bg-dark-lighter border border-gray-700 p-6 rounded-3xl w-full max-w-sm shadow-2xl relative">
                    <button
                        onClick={() => setShowLeaderboard(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>

                    <h3 className="text-xl font-bold text-white mb-6 text-center">🏆 Leaderboard</h3>

                    <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/20">
                        {players
                            .concat(Object.keys(scores).filter(p => !players.includes(p)))
                            .filter((item, index, self) => self.indexOf(item) === index)
                            .filter(p => players.includes(p))
                            .sort((a, b) => (scores[b] || 0) - (scores[a] || 0))
                            .map((p, i) => (
                                <div key={p} className={`flex items-center justify-between px-4 py-3 ${i !== players.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-black w-6 text-center ${i === 0 ? 'text-yellow-400' : 'text-gray-600'}`}>{i + 1}</span>
                                        <span className="text-white font-bold">{p}</span>
                                    </div>
                                    <span className="text-emerald-400 font-black">{scores[p] || 0} pts</span>
                                </div>
                            ))}
                        {players.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">No scores yet!</p>}
                    </div>
                </div>
            </div>
        );
    };

    // --- RENDERERS ---

    if (gameState === 'SETUP') {
        const canStart = players.length >= 3 && selectedCategories.length > 0;

        return (
            <div className="flex flex-col gap-6 w-full max-w-md mx-auto p-6 animate-fade-in relative z-10 text-center min-h-[60vh] justify-center">
                <BackgroundBlobs />
                <CustomEditorModal />
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                    Local Party
                </h2>

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
                        {players.length === 0 && <span className="text-gray-500 text-sm italic py-2">Add 3+ players</span>}
                    </ul>
                </div>

                <div className="glass-card rounded-2xl p-4 flex flex-col gap-4">
                    {/* Settings in Setup */}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-2">
                            <span className="text-red-400 font-bold text-xs uppercase">Chaos Mode</span>
                            <div className="relative group">
                                <span className="text-gray-400 cursor-help text-xs border border-gray-600 rounded-full w-4 h-4 flex items-center justify-center">i</span>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-6 w-48 bg-gray-800 text-xs text-gray-300 p-2 rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                                    90% One Imposter<br />
                                    9% Two Imposters<br />
                                    1% Everyone is Imposter!
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setChaosMode(!chaosMode)}
                            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${chaosMode ? 'bg-red-500' : 'bg-gray-700'}`}
                        >
                            <div className={`w-4 h-4 rounded-full bg-white transition-transform ${chaosMode ? 'translate-x-5' : 'translate-x-0'}`} />
                        </button>
                    </div>

                    <div className={`flex items-center justify-between border-b border-white/5 pb-4 transition-opacity ${chaosMode ? 'opacity-30 pointer-events-none' : ''}`}>
                        <span className="text-blue-200/60 font-bold text-xs uppercase">Imposters</span>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setImposterCount(Math.max(1, imposterCount - 1))}
                                disabled={imposterCount <= 1}
                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold disabled:opacity-30"
                            >-</button>
                            <span className="font-black w-4 text-center">{chaosMode ? '?' : imposterCount}</span>
                            <button
                                onClick={() => setImposterCount(Math.min(maxImposters || 1, imposterCount + 1))}
                                disabled={imposterCount >= (maxImposters || 1)}
                                className="w-8 h-8 rounded bg-white/10 flex items-center justify-center font-bold disabled:opacity-30"
                            >+</button>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-blue-200/60 font-bold text-xs uppercase">Categories</span>
                            <span className="text-xs text-gray-500">{selectedCategories.length} selected</span>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto">
                            {wordList.map((c) => {
                                const isSelected = selectedCategories.includes(c.category);
                                return (
                                    <button
                                        key={c.category}
                                        onClick={() => toggleCategory(c.category)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${isSelected
                                            ? 'bg-blue-500 text-white border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                            : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        {c.category}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={startGame}
                        disabled={!canStart}
                        className={`w-full py-4 font-bold text-lg rounded-2xl transition-all shadow-lg border border-transparent ${canStart
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

    // Common layout for active game states
    const activeLayout = (content) => (
        <div className="flex flex-col items-center gap-6 w-full max-w-md mx-auto p-6 animate-fade-in relative z-10 text-center min-h-[60vh] justify-center">
            <BackgroundBlobs />
            <GearIcon />
            <TrophyIcon />
            <SettingsModal />
            <LeaderboardModal />
            {content}
        </div>
    );

    if (gameState === 'HUB') {
        const allSeen = seenPlayers.size === players.length;
        return activeLayout(
            <>
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
                        onClick={startActionPhase}
                        disabled={!allSeen}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg border border-transparent ${allSeen
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/40 animate-pulse hover:scale-[1.02] border-emerald-400/30'
                            : 'bg-white/5 text-gray-600 border-white/5 cursor-not-allowed'
                            }`}
                    >
                        Start Game
                    </button>
                </div>
            </>
        );
    }

    if (gameState === 'REVEAL_MODAL') {
        const isImposter = imposterIndices.includes(viewingPlayerIndex);
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
        const startPlayerName = players[startPlayerIndex];
        return activeLayout(
            <>
                <h2 className="text-4xl font-black text-white mb-2">Discuss & Vote</h2>

                <div className="w-full flex justify-center mb-4">
                    <div className="glass-card px-8 py-3 rounded-full border border-white/10 shadow-lg flex items-center gap-3">
                        <span className="text-gray-300 font-medium">Category:</span>
                        <span className="text-blue-400 font-bold uppercase tracking-wider">{category}</span>
                    </div>
                </div>

                <div className="w-full glass-card p-5 md:p-8 rounded-3xl border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

                    <p className="text-sm text-gray-500 font-bold uppercase tracking-[0.2em] mb-6">First Question</p>

                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="relative">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/30 animate-[spin_10s_linear_infinite]">
                                <span className="text-3xl animate-[spin_10s_linear_infinite_reverse]">🎲</span>
                            </div>
                            <div className="absolute -bottom-2 right-0 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-300 shadow-sm">
                                STARTS
                            </div>
                        </div>

                        <div>
                            <p className="text-white font-black text-3xl tracking-tight">{startPlayerName}</p>
                            <p className="text-blue-200/60 text-sm font-medium mt-1">starts the discussion</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 w-full">
                    <button
                        onClick={startVoting}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-bold py-4 px-10 rounded-2xl shadow-lg shadow-blue-500/30 transition transform hover:scale-[1.02] active:scale-95 border border-blue-500/30"
                    >
                        Vote to Eliminate
                    </button>
                </div>
            </>
        );
    }

    if (gameState === 'VOTING') {
        const selectedName = votingSelection !== null ? players[votingSelection] : null;

        return activeLayout(
            <>
                <h2 className="text-4xl font-black text-white mb-2">Cast Your Vote</h2>
                <p className="text-gray-400 font-medium mb-6">Who is the Imposter?</p>

                <div className="grid grid-cols-2 gap-3 w-full mb-6 max-h-[50vh] overflow-y-auto">
                    {players.map((p, i) => {
                        const isSelected = votingSelection === i;
                        return (
                            <button
                                key={i}
                                onClick={() => setVotingSelection(i)}
                                className={`p-4 rounded-xl font-bold transition-all border-2 ${isSelected
                                    ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/40 scale-105'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                {p}
                            </button>
                        );
                    })}
                </div>

                <div className="w-full mt-auto">
                    <button
                        onClick={submitVote}
                        disabled={votingSelection === null}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg border border-transparent ${votingSelection !== null
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-red-500/40 hover:scale-[1.02] active:scale-95'
                            : 'bg-white/5 text-gray-600 border-white/5 cursor-not-allowed'
                            }`}
                    >
                        {selectedName ? `Vote Out ${selectedName}` : 'Select a Suspect'}
                    </button>
                </div>
            </>
        );
    }

    if (gameState === 'END') {
        // Collect all imposter names
        const imposterNames = imposterIndices.map(i => players[i]);
        const votedName = votingSelection !== null ? players[votingSelection] : "No one";
        const caughtImposter = votingSelection !== null && imposterIndices.includes(votingSelection);

        // Determine Win State
        const civiliansWin = caughtImposter;

        return activeLayout(
            <>
                <div className="animate-bounce mb-2">
                    <span className="text-7xl drop-shadow-2xl">{civiliansWin ? '🏆' : '😈'}</span>
                </div>

                <h2 className={`text-4xl font-black mb-2 ${civiliansWin ? 'text-emerald-400' : 'text-red-500'}`}>
                    {civiliansWin ? 'CIVILIANS WIN!' : 'IMPOSTER WINS!'}
                </h2>

                <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                    {civiliansWin
                        ? <span>You voted out <strong className="text-white">{votedName}</strong>, who was an Imposter!</span>
                        : <span>You voted out <strong className="text-white">{votedName}</strong>, but the Imposter was <strong className="text-red-400">{imposterNames.join(' & ')}</strong>.</span>
                    }
                </p>

                <div className="glass-card p-6 rounded-3xl w-full mb-6 border border-white/10">
                    <p className="text-xs text-blue-300 font-black uppercase tracking-widest mb-1">Secret Word</p>
                    <p className="text-3xl font-black text-white">{secretWord}</p>
                </div>

                {/* Leaderboard */}
                <div className="w-full mb-6">
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-3">Scoreboard</p>
                    <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
                        {players
                            .concat(Object.keys(scores).filter(p => !players.includes(p))) // Include past players? Maybe just current.
                            .filter((item, index, self) => self.indexOf(item) === index) // Unique
                            .filter(p => players.includes(p)) // ONLY show current players for now to keep it clean
                            .sort((a, b) => (scores[b] || 0) - (scores[a] || 0)) // Sort by score DESC
                            .slice(0, 5) // Top 5
                            .map((p, i) => (
                                <div key={p} className={`flex items-center justify-between px-4 py-3 ${i !== players.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`font-black w-6 text-center ${i === 0 ? 'text-yellow-400' : 'text-gray-600'}`}>{i + 1}</span>
                                        <span className="text-white font-bold">{p}</span>
                                    </div>
                                    <span className="text-emerald-400 font-black">{scores[p] || 0} pts</span>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="flex gap-4 w-full">
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
            </>
        );
    }

    return null;
}

export default LocalGame;
