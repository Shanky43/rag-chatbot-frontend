import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import { useSocket } from '../../hooks/useSocket';
import { apiService } from '../../services/api';
import { generateSessionId, formatTimestamp } from '../../utils/helpers';
import './RAGNewsChatBot.scss';

const RAGNewsChatBot = () => {
  // Socket connection
  const { isConnected, connectionError, isConnecting, reconnect, socket } = useSocket();

  // Session Management
  const [sessionId, setSessionId] = useState(() => generateSessionId());
  
  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Chat State
  const [chats, setChats] = useState([
    { 
      id: sessionId, 
      title: 'News Discussion', 
      lastMessage: 'Hello! Ask me about any news topic...', 
      timestamp: 'now' 
    }
  ]);
  
  const [activeChat, setActiveChat] = useState(sessionId);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      type: 'system', 
      sender: 'system',
      content: 'Hello! I\'m your RAG-powered news chatbot. I can search through news articles and provide you with accurate, up-to-date information. Ask me about technology, sports, politics, economy, or any current events!', 
      timestamp: formatTimestamp()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);

  // Typing timeout ref
  const typingTimeoutRef = useRef(null);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isNowMobile = window.innerWidth <= 1024; // Changed to 1024px for better desktop experience
      setIsMobile(isNowMobile);
      
      // On large screens (desktop/laptop), sidebar should always be open
      // On smaller screens, it should be overlay only
      if (!isNowMobile) {
        // Desktop: sidebar always open
        setIsSidebarOpen(true);
      } else {
        // Mobile/Tablet: sidebar is overlay, starts closed
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Socket event listeners
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Auto-join session when connected
    socket.joinSession(sessionId);

    // Set up socket event listeners
    const handleSessionJoined = (data) => {
      console.log('Session joined:', data);
      setSessionId(data.sessionId);
      if (data.history && data.history.length > 0) {
        setMessages(data.history);
      }
    };

    const handleNewMessage = (message) => {
      console.log('New message received:', message);
      setMessages(prev => [...prev, {
        ...message,
        timestamp: message.timestamp || formatTimestamp()
      }]);
      setIsLoading(false);
    };

    const handleSessionHistory = (data) => {
      console.log('Session history received:', data);
      if (data.history) {
        setMessages(data.history);
      }
    };

    const handleSessionCleared = (data) => {
      console.log('Session cleared:', data);
      setMessages([
        { 
          id: Date.now(), 
          type: 'system', 
          sender: 'system',
          content: 'Session cleared! I\'m ready for a fresh conversation. What would you like to know about current news?', 
          timestamp: formatTimestamp()
        }
      ]);
      setIsLoading(false);
    };

    const handleUserTyping = (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    };

    const handleSocketError = (error) => {
      console.error('Socket error:', error);
      setIsLoading(false);
      const errorMessage = {
        id: Date.now(),
        type: 'system',
        sender: 'system',
        content: `Error: ${error.message || 'Connection error occurred'}`,
        timestamp: formatTimestamp()
      };
      setMessages(prev => [...prev, errorMessage]);
    };

    socket.on('session_joined', handleSessionJoined);
    socket.on('new_message', handleNewMessage);
    socket.on('session_history', handleSessionHistory);
    socket.on('session_cleared', handleSessionCleared);
    socket.on('user_typing', handleUserTyping);
    socket.on('socket_error', handleSocketError);

    return () => {
      socket.off('session_joined', handleSessionJoined);
      socket.off('new_message', handleNewMessage);
      socket.off('session_history', handleSessionHistory);
      socket.off('session_cleared', handleSessionCleared);
      socket.off('user_typing', handleUserTyping);
      socket.off('socket_error', handleSocketError);
    };
  }, [socket, isConnected, sessionId]);

  // Event Handlers
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.setTyping(sessionId, false);
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      sender: 'user',
      content: messageText,
      timestamp: formatTimestamp()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    // Send message via socket if connected, otherwise fallback to REST API
    if (socket && isConnected) {
      socket.sendMessage(messageText, sessionId);
    } else {
      // Fallback to REST API
      try {
        const response = await apiService.searchNews(messageText);
        const botMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          sender: 'assistant',
          content: response.aiAnswer || response.message || 'No response received',
          timestamp: formatTimestamp(),
          sources: response.sourceDetails ? [response.sourceDetails] : [],
          metadata: {
            source: response.source,
            searchStep: response.searchStep,
            totalFound: response.totalFound,
            sourceDetails: response.sourceDetails,
            sourcesConsidered: response.sourcesConsidered
          }
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        console.error('Error calling API:', error);
        const errorMessage = {
          id: Date.now() + 1,
          type: 'system',
          sender: 'system',
          content: 'Sorry, I encountered an error while processing your request. Please check your connection and try again.',
          timestamp: formatTimestamp()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNewChat = () => {
    if (socket && isConnected) {
      // Create new session via API
      apiService.createSession()
        .then(response => {
          const newSessionId = response.sessionId;
          const newChat = {
            id: newSessionId,
            title: 'New Chat',
            lastMessage: '',
            timestamp: 'now'
          };
          
          setChats([newChat, ...chats]);
          setActiveChat(newSessionId);
          setSessionId(newSessionId);
          setMessages([]);
          
          // Join the new session
          socket.joinSession(newSessionId);
        })
        .catch(error => {
          console.error('Failed to create new session:', error);
          // Fallback to local session
          const newSessionId = generateSessionId();
          const newChat = {
            id: newSessionId,
            title: 'New Chat',
            lastMessage: '',
            timestamp: 'now'
          };
          
          setChats([newChat, ...chats]);
          setActiveChat(newSessionId);
          setSessionId(newSessionId);
          setMessages([
            { 
              id: 1, 
              type: 'system', 
              sender: 'system',
              content: 'Hello! I\'m your RAG-powered news chatbot. Ask me about any recent news, current events, or topics you\'re curious about!', 
              timestamp: formatTimestamp()
            }
          ]);
        });
    }
  };

  const handleClearSession = async () => {
    if (socket && isConnected) {
      socket.clearSession(sessionId);
    } else {
      // Fallback to REST API
      try {
        await apiService.clearSessionCache(sessionId);
        setMessages([
          { 
            id: 1, 
            type: 'system', 
            sender: 'system',
            content: 'Session cleared! I\'m ready for a fresh conversation. What would you like to know about current news?', 
            timestamp: formatTimestamp()
          }
        ]);
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
  };

  const handleChatSelect = (chatId) => {
    setActiveChat(chatId);
    // In a real implementation, you would load chat history here
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleInputChange = (value) => {
    setInputMessage(value);
    
    // Handle typing indicator
    if (socket && isConnected) {
      socket.setTyping(sessionId, true);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        socket.setTyping(sessionId, false);
      }, 1000);
    }
  };

  return (
    <div className={`rag-news-chatbot ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      
      <Sidebar 
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={closeSidebar}
      />
      
      <MainContent
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={handleInputChange}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onClearSession={handleClearSession}
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        connectionStatus={{
          isConnected,
          connectionError,
          isConnecting,
          onReconnect: reconnect
        }}
        typingUsers={typingUsers}
      />
    </div>
  );
};

export default RAGNewsChatBot;