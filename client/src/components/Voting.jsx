import React, { useState } from 'react';
import socket from '../socket';

function Voting({ room, playerName }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Derive voting state
    const self = room.players.find(p => p.name === playerName);
    const hasVoted = self?.vote !== null && self?.vote !== undefined;

    // How many imposters to vote for
    const imposterCount = room.imposterCount ?? 1;

    const toggleSelect = (playerId) => {
        if (hasVoted) return;

        if (selectedIds.includes(playerId)) {
            setSelectedIds(selectedIds.filter(id => id !== playerId));
        } else {
            // Limit selections to imposterCount
            if (selectedIds.length < imposterCount) {
                setSelectedIds([...selectedIds, playerId]);
            } else if (imposterCount === 1) {
                // If only 1 selection allowed, replace
                setSelectedIds([playerId]);
            } else {
                // If multiple allowed but limit reached, maybe alert or do nothing? 
                // For now, let's allow replacing the last one or just ignore. 
                // Better: Do nothing (user must deselect first), or shift?
                // Maintaining existing "do nothing" behavior but logging it might help.
                console.log("Max selection reached");
            }
        }
    };

    const handleSubmit = () => {
        console.log("Submitting vote:", { code: room.code, selected: selectedIds });
        if (selectedIds.length === 0) return;

        if (!room.code) {
            console.error("Room code is missing!");
            return;
        }

        setIsSubmitted(true); // Optimistic UI update

        // Vote for first selected (server handles one vote per player)
        socket.emit('vote', { code: room.code, voteId: selectedIds[0] });
    };

    return (
        <div className="w-full flex flex-col items-center gap-6">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-2">Who is the Imposter?</h2>
                {imposterCount > 1 && (
                    <p className="text-gray-400 text-sm">Select up to {imposterCount} suspects</p>
                )}
            </div>

            {/* Show voting UI if NOT voted AND NOT optimistically submitted */}
            {!hasVoted && !isSubmitted ? (
                <>
                    <div className="grid grid-cols-1 gap-3 w-full">
                        {room.players.map((p) => {
                            const isSelected = selectedIds.includes(p.id);
                            return (
                                <button
                                    key={p.id}
                                    onClick={() => toggleSelect(p.id)}
                                    className={`p-4 rounded-xl flex items-center justify-between transition-all border-2 ${isSelected
                                        ? 'bg-red-600 border-red-400 text-white shadow-lg shadow-red-500/40'
                                        : 'bg-dark-lighter border-gray-600 hover:border-red-500 hover:bg-red-900/20 text-gray-200'
                                        }`}
                                >
                                    <span className="font-bold text-lg">{p.name}</span>
                                    {isSelected && <span className="text-white font-bold">✓</span>}
                                </button>
                            );
                        })}
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={selectedIds.length === 0}
                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${selectedIds.length > 0
                            ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg shadow-red-500/40 hover:scale-[1.02] active:scale-95'
                            : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        {selectedIds.length > 0 ? `Submit Vote (${selectedIds.length} selected)` : 'Select Suspect(s)'}
                    </button>
                </>
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
