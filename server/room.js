class Room {
    constructor(code) {
        this.code = code;
        this.players = []; // { id, name, role, vote, isHost }
        this.gameState = 'LOBBY'; // LOBBY, PLAYING, VOTING, END
        this.secretWord = '';
        this.imposterWord = 'IMPOSTER';
        this.category = '';
        this.votes = {}; // playerId -> voteCount
        this.winner = null;
        this.usedWords = [];
        this.scores = {}; // playerName -> points

        // Host Settings
        this.imposterCount = 1;
        this.public = true; // Visible in Active Lobbies?
        this.chaosMode = false;
        this.selectedCategories = ['Animals', 'Food', 'Jobs', 'Objects', 'Places'];
        this.customWords = []; // Custom words list
    }

    addPlayer(id, name) {
        if (!name) return false; // Failed to add

        // Smart Reconnect: If name exists, update the socket ID and connected status
        const existingPlayer = this.players.find(p => p.name.toUpperCase() === name.toUpperCase());
        if (existingPlayer) {
            existingPlayer.id = id;
            existingPlayer.connected = true;
            return true; // Success
        }

        const isHost = this.players.length === 0;
        this.players.push({ id, name, role: null, vote: null, isHost, connected: true });
        return true; // Success
    }

    disconnectPlayer(id) {
        const player = this.players.find(p => p.id === id);
        if (player) {
            player.connected = false;
        }

        // Auto-End Game if active players drop below 3 while playing
        if (this.gameState === 'PLAYING' || this.gameState === 'VOTING') {
            const activeCount = this.players.filter(p => p.connected).length;
            if (activeCount < 3) {
                console.log(`Room ${this.code}: Active players (${activeCount}) < 3. Resetting game.`);
                this.resetGame();
            }
        }

        // Return true if ALL players are disconnected (room is empty of active users)
        return this.players.every(p => !p.connected);
    }

    // Completely remove a player (optional, maybe for a future 'Leave' button)
    removePlayer(id) {
        this.players = this.players.filter(p => p.id !== id);
        if (this.players.length > 0 && !this.players.some(p => p.isHost && p.connected)) {
            // Try to find a connected player to be host
            const nextHost = this.players.find(p => p.connected) || this.players[0];
            if (nextHost) nextHost.isHost = true;
        }
    }

    getPlayer(id) {
        return this.players.find(p => p.id === id);
    }

    startGame(word, category) {
        if (this.players.length < 3) return false; // Minimum players check

        this.gameState = 'PLAYING';
        this.secretWord = word;
        this.category = category;
        this.winner = null;
        this.votes = {};

        // Assign Roles - Support multiple imposters
        const safeImposterCount = Math.min(this.imposterCount, Math.max(1, this.players.length - 1));
        const imposterIndices = new Set();
        while (imposterIndices.size < safeImposterCount) {
            imposterIndices.add(Math.floor(Math.random() * this.players.length));
        }

        this.players.forEach((p, i) => {
            p.role = imposterIndices.has(i) ? 'IMPOSTER' : 'CIVILIAN';
            p.vote = null;
        });

        return true;
    }

    vote(voterId, targetId) {
        const voter = this.getPlayer(voterId);
        if (voter && this.gameState === 'VOTING') {
            voter.vote = targetId;
        }
        // Check if everyone voted
        const votedCount = this.players.filter(p => p.vote).length;
        if (votedCount === this.players.length) {
            this.endGame();
            return true; // Game ended
        }
        return false;
    }

    startVoting() {
        this.gameState = 'VOTING';
    }

    endGame() {
        this.gameState = 'END';
        // Tally votes
        const voteCounts = {};
        this.players.forEach(p => {
            if (p.vote) {
                voteCounts[p.vote] = (voteCounts[p.vote] || 0) + 1;
            }
        });

        // Find suspect
        let maxVotes = 0;
        let suspectId = null;
        for (const [id, count] of Object.entries(voteCounts)) {
            if (count > maxVotes) {
                maxVotes = count;
                suspectId = id;
            } else if (count === maxVotes) {
                suspectId = null; // Tie
            }
        }

        const suspect = this.getPlayer(suspectId);
        const imposters = this.players.filter(p => p.role === 'IMPOSTER');

        // Determine winner
        if (suspect && suspect.role === 'IMPOSTER') {
            this.winner = 'CIVILIANS';
            // Civilians win: +1 to all civilians
            this.players.forEach(p => {
                if (p.role !== 'IMPOSTER') {
                    this.scores[p.name] = (this.scores[p.name] || 0) + 1;
                }
            });
        } else {
            this.winner = 'IMPOSTER';
            // Imposters win: +3 to all imposters
            imposters.forEach(imposter => {
                this.scores[imposter.name] = (this.scores[imposter.name] || 0) + 3;
            });
        }
    }

    resetGame() {
        this.gameState = 'LOBBY';
        this.secretWord = '';
        this.category = '';
        this.winner = null;
        this.votes = {};
        this.players.forEach(p => {
            p.role = null;
            p.vote = null;
        });
    }
}

module.exports = Room;
