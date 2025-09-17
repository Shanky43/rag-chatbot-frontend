import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Connect to socket on mount
    setIsConnecting(true);
    const socket = socketService.connect();

    // Set up event listeners
    const handleConnectionStatus = ({ connected, reason }) => {
      setIsConnected(connected);
      setIsConnecting(false);
      if (!connected && reason) {
        setConnectionError(reason);
      } else {
        setConnectionError(null);
      }
    };

    const handleConnectionError = ({ error }) => {
      setConnectionError(error);
      setIsConnected(false);
      setIsConnecting(false);
    };

    socketService.on('connection_status', handleConnectionStatus);
    socketService.on('connection_error', handleConnectionError);

    // Cleanup on unmount
    return () => {
      socketService.off('connection_status', handleConnectionStatus);
      socketService.off('connection_error', handleConnectionError);
      socketService.disconnect();
    };
  }, []);

  const reconnect = useCallback(() => {
    setIsConnecting(true);
    setConnectionError(null);
    socketService.connect();
  }, []);

  return {
    isConnected,
    connectionError,
    isConnecting,
    reconnect,
    socket: socketService
  };
};