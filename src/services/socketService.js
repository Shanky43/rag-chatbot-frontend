
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.listeners = new Map();
  }

  connect(url = import.meta.env.VITE_BACKEND_HOST
    ? `${import.meta.env.VITE_BACKEND_HOST}`
    : 'http://localhost:5000'  // Changed from 5432 to typical web port
  ) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket.id);
      this.isConnected = true;
      this.emit('connection_status', { connected: true });
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      this.isConnected = false;
      this.emit('connection_status', { connected: false, reason });
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.isConnected = false;
      this.emit('connection_error', { error: error.message });
    });

    // Backend event listeners
    this.socket.on('session_joined', (data) => {
      console.log('Session joined:', data);
      this.emit('session_joined', data);
    });

    this.socket.on('new_message', (message) => {
      console.log('New message received:', message);
      this.emit('new_message', message);
    });

    this.socket.on('session_history', (data) => {
      console.log('Session history received:', data);
      this.emit('session_history', data);
    });

    this.socket.on('session_cleared', (data) => {
      console.log('Session cleared:', data);
      this.emit('session_cleared', data);
    });

    // ADDED: Status update listener for engaging loading messages
    this.socket.on('status_update', (data) => {
      console.log('Status update received:', data);
      this.emit('status_update', data);
    });

    this.socket.on('user_typing', (data) => {
      this.emit('user_typing', data);
    });

    this.socket.on('message_error', (error) => {
      console.error('Message error:', error);
      this.emit('message_error', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
      this.emit('socket_error', error);
    });
  }

  // Event emitter methods
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Socket.IO methods
  joinSession(sessionId = null) {
    if (this.socket && this.isConnected) {
      console.log('Joining session:', sessionId);
      this.socket.emit('join_session', { sessionId });
    }
  }

  sendMessage(message, sessionId) {
    if (this.socket && this.isConnected) {
      console.log('Sending message:', { message, sessionId });
      this.socket.emit('send_message', { message, sessionId });
    }
  }

  getHistory(sessionId, limit = 50) {
    if (this.socket && this.isConnected) {
      this.socket.emit('get_history', { sessionId, limit });
    }
  }

  clearSession(sessionId) {
    if (this.socket && this.isConnected) {
      console.log('Clearing session:', sessionId);
      this.socket.emit('clear_session', { sessionId });
    }
  }

  setTyping(sessionId, isTyping) {
    if (this.socket && this.isConnected) {
      this.socket.emit('typing', { sessionId, isTyping });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.listeners.clear();
    }
  }

  getConnectionStatus() {
    return this.isConnected;
  }
}

// Export singleton instance
export default new SocketService();