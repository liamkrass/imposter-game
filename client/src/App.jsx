import React, { useState, useEffect } from 'react';
import socket from './socket';

// Components (will create next)
import Landing from './components/Landing';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Voting from './components/Voting';
import Results from './components/Results';

function App() {
  const [room, setRoom] = useState(null);
  const [playerName, setPlayerName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    socket.on('room_update', (updatedRoom) => {
      setRoom(updatedRoom);
      setError('');
    });

    return () => {
      socket.off('room_update');
    };
  }, []);

  const renderView = () => {
    if (!room) {
      return <Landing setRoom={setRoom} setPlayerName={setPlayerName} setError={setError} />;
    }

    switch (room.gameState) {
      case 'LOBBY':
        return <Lobby room={room} playerName={playerName} />;
      case 'PLAYING':
        return <Game room={room} playerName={playerName} />;
      case 'VOTING':
        return <Voting room={room} playerName={playerName} />;
      case 'END':
        return <Results room={room} playerName={playerName} />;
      default:
        return <div>Unknown State</div>;
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-dark-lighter p-6 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          IMPOSTER
        </h1>
        {error && (
          <div className="bg-red-500/20 text-red-200 p-3 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {renderView()}
      </div>
    </div>
  );
}

export default App;
