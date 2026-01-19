import React from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Landing from './components/Landing';
import Home from './components/Home'; // The new Online Menu
import RoomController from './components/RoomController';
import LocalGame from './components/LocalGame';

// Wrapper to pass navigate as onExit to LocalGame
const LocalGameWrapper = () => {
  const navigate = useNavigate();
  return <LocalGame onExit={() => navigate('/')} />;
};

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-dark text-white flex flex-col items-center justify-center p-4">
        {/* We keep the container simple, individual pages handle their cards/layout */}
        <div className="w-full max-w-md">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/local" element={<LocalGameWrapper />} />
            <Route path="/online" element={<Home />} />
            <Route path="/room/:roomCode" element={<RoomController />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
