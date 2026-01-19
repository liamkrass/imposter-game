import React, { useState } from 'react';
import socket from '../socket';

function Voting({ room, playerName }) {
    // Derive voted state from room players list (synced from server)
    const self = room.players.find(p => p.name === playerName);
    const hasVoted = self?.vote !== null && self?.vote !== undefined;

    const handleVote = (targetId) => {
        if (hasVoted) return; // Prevent double voting
        socket.emit('vote', { code: room.code, voteId: targetId });
    };

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <h2 className="text-3xl font-bold text-white mb-4">Who is the Imposter?</h2>

            {!hasVoted ? (
                <div className="grid grid-cols-1 gap-3 w-full">
                    {room.players.map((p) => {
                        if (p.name === playerName) return null; // Can't vote for self? usually yes, or skip rendering.
                        // Actually in these games you can vote anyone.

                        return (
                            <button
                                key={p.id}
                                onClick={() => handleVote(p.id)}
                                className="bg-dark-lighter border border-gray-600 hover:border-red-500 hover:bg-red-900/20 p-4 rounded-xl flex items-center justify-between group transition-all"
                            >
                                <span className="font-bold text-lg text-gray-200 group-hover:text-white">{p.name}</span>
                                <span className="text-gray-500 text-sm group-hover:text-red-400">VOTE</span>
                            </button>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-10 animate-pulse">
                    <p className="text-xl text-gray-300">Vote Cast</p>
                    <p className="text-gray-500">Waiting for others...</p>
                </div>
            )}
        </div>
    );
}

export default Voting;
