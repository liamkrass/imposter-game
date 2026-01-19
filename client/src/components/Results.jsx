import React from 'react';
import socket from '../socket';

function Results({ room, playerName }) {
    const imposter = room.players.find(p => p.role === 'IMPOSTER');
    const isHost = room.players.find(p => p.name === playerName)?.isHost;

    // Check if civilians won
    const civiliansWon = room.winner === 'CIVILIANS';

    return (
        <div className="flex flex-col items-center gap-8 text-center w-full">
            <div className="animate-bounce">
                <span className="text-6xl">{civiliansWon ? '🎉' : '😈'}</span>
            </div>

            <div>
                <h2 className={`text-5xl font-black mb-2 tracking-tighter ${civiliansWon ? 'text-green-400' : 'text-red-500'}`}>
                    {civiliansWon ? 'CIVILIANS WIN!' : 'IMPOSTER WINS!'}
                </h2>
                <p className="text-gray-400">
                    The imposter was <span className="text-white font-bold">{imposter?.name}</span>
                </p>
            </div>

            <div className="bg-dark-lighter p-6 rounded-xl border border-gray-700 w-full">
                <p className="text-sm text-gray-500 uppercase tracking-widest mb-4">Secret Word</p>
                <p className="text-3xl font-bold text-primary">{room.secretWord}</p>
            </div>

            {isHost && (
                <button
                    onClick={() => socket.emit('reset_game', room.code)}
                    className="w-full bg-white text-dark font-bold p-4 rounded-xl hover:scale-105 transition shadow-lg shadow-white/20"
                >
                    Play Again
                </button>
            )}
        </div>
    );
}

export default Results;
