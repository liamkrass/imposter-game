import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';
const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket'] // Force WebSocket to avoid polling issues/sticky session requirements
});

export default socket;
