import React, { useState } from 'react';
import socket from '../socket';

function Game({ room, playerName }) {
    const [revealed, setRevealed] = useState(false);
    const self = room.players.find(p => p.name === playerName);
    const isImposter = self?.role === 'IMPOSTER';

    const handleVoteStart = () => {
        socket.emit('vote', { code: room.code, voteId: null }); // Using vote to trigger phase? No, need a trigger.
        // Actually server/index.js doesn't have a 'start_voting' event explicitly triggered by user, 
        // usually games like this have a timer or manual 'Time to Vote' button.
        // Let's add a simple vote trigger or just rely on 'vote' event if I change logic.
        // Wait, my Room.js has startVoting(). But server/index.js doesn't expose it.
        // I should add 'start_voting' event to server.
        // For now, I'll assume anyone can trigger it or I'll add the event to server code.
        socket.emit('start_voting', room.code);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full">
            <div className="bg-dark-lighter p-3 rounded-full border border-gray-700">
                <span className="text-gray-400 text-sm uppercase font-bold tracking-wider">Category: </span>
                <span className="text-secondary font-bold">{room.category}</span>
            </div>

            <div
                onClick={() => setRevealed(!revealed)}
                className={`w-64 h-80 cursor-pointer perspective-1000 transition-all duration-500 transform ${revealed ? 'rotate-y-180' : ''}`}
            >
                <div className={`relative w-full h-full rounded-2xl shadow-2xl flex items-center justify-center p-6 text-center select-none transition-colors duration-500 border-2 ${revealed
                    ? (isImposter ? 'bg-red-900/20 border-red-500' : 'bg-primary/20 border-primary')
                    : 'bg-dark-lighter border-gray-700 hover:border-gray-500'
                    }`}>
                    {!revealed ? (
                        <div className="flex flex-col items-center">
                            <span className="text-6xl mb-4">🕵️</span>
                            <h3 className="text-2xl font-bold text-gray-300">TAP TO REVEAL</h3>
                            <p className="text-gray-500 text-sm mt-2">Keep it secret!</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center animate-fade-in">
                            <p className="text-gray-400 text-xs uppercase font-bold mb-2">YOUR WORD IS</p>
                            {isImposter ? (
                                <>
                                    <h2 className="text-4xl font-black text-red-500 tracking-widest mb-2">IMPOSTER</h2>
                                    <p className="text-red-300 text-sm">Blend in. Don't get caught.</p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-4xl font-black text-primary tracking-widest mb-2">{room.secretWord}</h2>
                                    <p className="text-purple-300 text-sm">Find the imposter!</p>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-400 mb-4">Discuss with other players...</p>
                <button
                    onClick={handleVoteStart}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-red-900/50 transition transform hover:scale-105"
                >
                    Start Voting
                </button>
            </div>
        </div>
    );
}

export default Game;
