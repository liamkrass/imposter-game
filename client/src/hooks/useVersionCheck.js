import { useEffect, useState } from 'react';
import socket from '../socket';

const CURRENT_CLIENT_VERSION = '1.1'; // MUST match server

export const useVersionCheck = () => {
    const [isStale, setIsStale] = useState(false);

    useEffect(() => {
        if (!socket.connected) return;

        socket.emit('get_version', (response) => {
            if (response && response.version !== CURRENT_CLIENT_VERSION) {
                console.warn(`Version Mismatch! Client: ${CURRENT_CLIENT_VERSION}, Server: ${response.version}`);
                setIsStale(true);
            }
        });
    }, [socket.connected]);

    useEffect(() => {
        if (isStale) {
            // Force hard reload to bust cache
            console.log("Forcing hard reload due to version mismatch...");
            // Add a timestamp query param to force browser to fetch fresh index.html
            window.location.href = window.location.pathname + '?v=' + Date.now();
        }
    }, [isStale]);

    return isStale;
};
