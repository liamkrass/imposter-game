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
    }

    addPlayer(id, name) {
        // valid checks
        if (!name) return this.players;

        // Smart Reconnect: If name exists, update the socket ID (assume reconnect)
        const existingPlayer = this.players.find(p => p.name.toUpperCase() === name.toUpperCase());
        if (existingPlayer) {
            existingPlayer.id = id;
            // existingPlayer.isHost = existingPlayer.isHost; // Keep host status
            return this.players;
        }

        const isHost = this.players.length === 0;
        this.players.push({ id, name, role: null, vote: null, isHost });
        return this.players;
    }

    removePlayer(id) {
        this.players = this.players.filter(p => p.id !== id);
        if (this.players.length > 0 && !this.players.some(p => p.isHost)) {
            this.players[0].isHost = true; // Assign new host
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

        // Assign Roles
        const imposterIndex = Math.floor(Math.random() * this.players.length);
        this.players.forEach((p, i) => {
            p.role = i === imposterIndex ? 'IMPOSTER' : 'CIVILIAN';
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
        const imposter = this.players.find(p => p.role === 'IMPOSTER');

        if (suspect && suspect.role === 'IMPOSTER') {
            this.winner = 'CIVILIANS';
        } else {
            this.winner = 'IMPOSTER';
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
