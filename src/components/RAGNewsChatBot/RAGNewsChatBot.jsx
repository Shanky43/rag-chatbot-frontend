import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import { useSocket } from '../../hooks/useSocket';
import { apiService, loadAllSessions, createNewSession, deleteSession } from '../../services/api';
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
  const [chats, setChats] = useState([]);
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

  // ADDED: Status update state for engaging loading messages
  const [statusUpdate, setStatusUpdate] = useState(null);

  // Loading states
  const [isLoadingSessions, setIsLoadingSessions] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Typing timeout ref
  const typingTimeoutRef = useRef(null);

  // ADDED: Message processing tracker to prevent duplicates
  const processedMessages = useRef(new Set());

  // Load all sessions on component mount
  useEffect(() => {
    loadSessions();
  }, []);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      const isNowMobile = window.innerWidth <= 1024;
      setIsMobile(isNowMobile);
      
      if (!isNowMobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // ENHANCED: Socket event listeners with better duplicate prevention and status updates
  useEffect(() => {
    if (!socket || !isConnected) return;

    // Auto-join session when connected
    socket.joinSession(sessionId);

    // Set up socket event listeners
    const handleSessionJoined = (data) => {
      console.log('Session joined:', data);
      setSessionId(data.sessionId);
      if (data.history && data.history.length > 0) {
        // Clear processed messages tracker for new session
        processedMessages.current.clear();
        setMessages(data.history);
      }
    };

    // FIXED: Enhanced message handler with comprehensive duplicate prevention
    const handleNewMessage = (message) => {
      console.log('New message received:', message);
      
      // Create unique message key
      const messageKey = `${message.id}_${message.sessionId || sessionId}_${message.timestamp}`;
      
      // Check if we've already processed this message
      if (processedMessages.current.has(messageKey)) {
        console.log('Message already processed, skipping:', message.id);
        return;
      }

      setMessages(prev => {
        // Double-check for duplicates in existing messages
        const isDuplicate = prev.some(existingMsg => {
          const isSameId = existingMsg.id === message.id;
          const isSameContent = existingMsg.content === message.content && 
                               existingMsg.sender === message.sender && 
                               Math.abs(new Date(existingMsg.timestamp).getTime() - new Date(message.timestamp).getTime()) < 5000;
          return isSameId || isSameContent;
        });
        
        if (isDuplicate) {
          console.log('Duplicate message detected in state, skipping:', message.id);
          return prev;
        }
        
        // Mark message as processed
        processedMessages.current.add(messageKey);
        
        // Clear any status updates when message is received
        setStatusUpdate(null);
        setIsLoading(false);
        
        const newMessage = {
          ...message,
          timestamp: message.timestamp || formatTimestamp()
        };
        
        // Update chat list with new message
        updateChatLastMessage(sessionId, message.content);
        
        return [...prev, newMessage];
      });
    };

    const handleSessionHistory = (data) => {
      console.log('Session history received:', data);
      if (data.history) {
        // Clear processed messages tracker for history load
        processedMessages.current.clear();
        setMessages(data.history);
      }
    };

    // FIXED: Session cleared handler for specific session only
    const handleSessionCleared = (data) => {
      console.log('Session cleared:', data);
      
      // Only clear if it's for the current session
      if (data.sessionId === sessionId) {
        processedMessages.current.clear();
        setMessages([
          { 
            id: `system-cleared-${Date.now()}`, 
            type: 'system', 
            sender: 'system',
            content: 'Session cleared! I\'m ready for a fresh conversation. What would you like to know about current news?', 
            timestamp: formatTimestamp()
          }
        ]);
        setIsLoading(false);
        setStatusUpdate(null);
        
        // Update chat list
        updateChatLastMessage(sessionId, 'Session cleared');
      }
    };

    // ADDED: Status update handler for engaging loading messages
    const handleStatusUpdate = (data) => {
      console.log('Status update:', data);
      if (data.visible) {
        setStatusUpdate(data);
        setIsLoading(true);
      }
    };

    const handleUserTyping = (data) => {
      if (data.isTyping) {
        setTypingUsers(prev => [...prev.filter(id => id !== data.userId), data.userId]);
      } else {
        setTypingUsers(prev => prev.filter(id => id !== data.userId));
      }
    };

    const handleMessageError = (error) => {
      console.error('Message error:', error);
      setIsLoading(false);
      setStatusUpdate(null);
      
      const errorMessage = {
        id: `error-${Date.now()}-${Math.random()}`,
        type: 'system',
        sender: 'system',
        content: `Error: ${error.error || error.message || 'Message sending failed'}`,
        timestamp: formatTimestamp()
      };
      setMessages(prev => [...prev, errorMessage]);
    };

    const handleSocketError = (error) => {
      console.error('Socket error:', error);
      setIsLoading(false);
      setStatusUpdate(null);
      
      const errorMessage = {
        id: `socket-error-${Date.now()}`,
        type: 'system',
        sender: 'system',
        content: `Connection error: ${error.message || 'Socket error occurred'}`,
        timestamp: formatTimestamp()
      };
      setMessages(prev => [...prev, errorMessage]);
    };

    socket.on('session_joined', handleSessionJoined);
    socket.on('new_message', handleNewMessage);
    socket.on('session_history', handleSessionHistory);
    socket.on('session_cleared', handleSessionCleared);
    socket.on('status_update', handleStatusUpdate);
    socket.on('user_typing', handleUserTyping);
    socket.on('message_error', handleMessageError);
    socket.on('socket_error', handleSocketError);

    return () => {
      socket.off('session_joined', handleSessionJoined);
      socket.off('new_message', handleNewMessage);
      socket.off('session_history', handleSessionHistory);
      socket.off('session_cleared', handleSessionCleared);
      socket.off('status_update', handleStatusUpdate);
      socket.off('user_typing', handleUserTyping);
      socket.off('message_error', handleMessageError);
      socket.off('socket_error', handleSocketError);
    };
  }, [socket, isConnected, sessionId]);

  // ENHANCED: Load all sessions with better title handling
  const loadSessions = async () => {
    setIsLoadingSessions(true);
    try {
      const response = await apiService.getAllSessions();
      const sessions = response.sessions || response || [];
      
      const formattedChats = sessions.map((session, index) => ({
        id: session.sessionId || session.id || session.session_id,
        title: session.title && session.title !== 'New Chat' 
          ? session.title 
          : `Chat ${index + 1}`,
        lastMessage: session.lastMessage || session.last_message || 'No messages yet',
        timestamp: session.updatedAt || session.updated_at || session.createdAt || session.created_at 
          ? new Date(session.updatedAt || session.updated_at || session.createdAt || session.created_at).toLocaleString() 
          : 'now',
        messageCount: session.messageCount || session.message_count || 0
      }));

      // If no sessions exist, create a default one
      if (formattedChats.length === 0) {
        const defaultChat = {
          id: sessionId,
          title: 'New Chat',
          lastMessage: 'Hello! Ask me about any news topic...',
          timestamp: 'now',
          messageCount: 1
        };
        setChats([defaultChat]);
      } else {
        setChats(formattedChats);
        // Set the first session as active if no session is currently active
        if (!activeChat && formattedChats.length > 0) {
          setActiveChat(formattedChats[0].id);
          setSessionId(formattedChats[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      // Keep the current default chat on error
      const defaultChat = {
        id: sessionId,
        title: 'New Chat',
        lastMessage: 'Hello! Ask me about any news topic...',
        timestamp: 'now',
        messageCount: 1
      };
      setChats([defaultChat]);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  // Load chat history for a specific session
  const loadChatHistory = async (sessionId) => {
    setIsLoadingHistory(true);
    try {
      const response = await apiService.getChatHistory(sessionId);
      const history = response.history || response.messages || [];
      
      if (history.length > 0) {
        // Clear processed messages tracker for new history
        processedMessages.current.clear();
        
        // Format messages to match expected structure with unique IDs
        const formattedHistory = history.map((msg, index) => ({
          ...msg,
          id: msg.id || `${sessionId}-${index}-${Date.now()}`, // Ensure unique IDs
          timestamp: msg.timestamp || formatTimestamp(),
          type: msg.type || (msg.sender === 'user' ? 'user' : 'assistant')
        }));
        setMessages(formattedHistory);
      } else {
        // No history, show welcome message
        processedMessages.current.clear();
        setMessages([
          { 
            id: `welcome-${sessionId}-${Date.now()}`, 
            type: 'system', 
            sender: 'system',
            content: 'Hello! I\'m your RAG-powered news chatbot. Ask me about any news topic!', 
            timestamp: formatTimestamp()
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
      // Show error message
      processedMessages.current.clear();
      setMessages([
        { 
          id: `error-${sessionId}-${Date.now()}`, 
          type: 'system', 
          sender: 'system',
          content: 'Failed to load chat history. Starting fresh conversation.', 
          timestamp: formatTimestamp()
        }
      ]);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Update chat's last message in the chat list
  const updateChatLastMessage = (sessionId, lastMessage) => {
    setChats(prev => prev.map(chat => 
      chat.id === sessionId 
        ? { 
            ...chat, 
            lastMessage: lastMessage.slice(0, 50) + (lastMessage.length > 50 ? '...' : ''),
            timestamp: new Date().toLocaleString(),
            messageCount: (chat.messageCount || 0) + 1,
            // FIXED: Update title with first user message if it's still "New Chat"
            title: chat.title === 'New Chat' && lastMessage.length > 0 
              ? lastMessage.slice(0, 30) + (lastMessage.length > 30 ? '...' : '')
              : chat.title
          }
        : chat
    ));
  };

  // FIXED: Enhanced message sending with duplicate prevention
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      socket.setTyping(sessionId, false);
    }

    setInputMessage('');
    setIsLoading(true);

    // Update chat list with user message (for sidebar preview)
    updateChatLastMessage(sessionId, messageText);

    // Send message via socket if connected
    if (socket && isConnected) {
      socket.sendMessage(messageText, sessionId);
    } else {
      // REST API fallback
      const userMessage = {
        id: `user-${sessionId}-${Date.now()}-${Math.random()}`,
        type: 'user',
        sender: 'user',
        content: messageText,
        timestamp: formatTimestamp()
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      try {
        const response = await apiService.searchNews(messageText);
        const botMessage = {
          id: `bot-${sessionId}-${Date.now()}-${Math.random()}`,
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
        updateChatLastMessage(sessionId, botMessage.content);
      } catch (error) {
        console.error('Error calling API:', error);
        const errorMessage = {
          id: `error-${sessionId}-${Date.now()}-${Math.random()}`,
          type: 'system',
          sender: 'system',
          content: 'Sorry, I encountered an error while processing your request. Please check your connection and try again.',
          timestamp: formatTimestamp()
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
        setStatusUpdate(null);
      }
    }
  };

  const handleNewChat = async () => {
    try {
      const response = await apiService.createSession();
      const newSessionId = response.sessionId || response.session_id || response.id;
      
      const newChat = {
        id: newSessionId,
        title: 'New Chat',
        lastMessage: 'New conversation started',
        timestamp: 'now',
        messageCount: 0
      };
      
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newSessionId);
      setSessionId(newSessionId);
      
      // Clear processed messages for new session
      processedMessages.current.clear();
      
      setMessages([
        { 
          id: `welcome-${newSessionId}-${Date.now()}`, 
          type: 'system', 
          sender: 'system',
          content: 'Hello! I\'m your RAG-powered news chatbot. Ask me about any recent news, current events, or topics you\'re curious about!', 
          timestamp: formatTimestamp()
        }
      ]);
      
      // Join the new session if socket is connected
      if (socket && isConnected) {
        socket.joinSession(newSessionId);
      }

      // Close sidebar on mobile after creating new chat
      if (isMobile) {
        setIsSidebarOpen(false);
      }
    } catch (error) {
      console.error('Failed to create new session:', error);
      // Fallback to local session
      const newSessionId = generateSessionId();
      const newChat = {
        id: newSessionId,
        title: 'New Chat',
        lastMessage: 'New conversation started',
        timestamp: 'now',
        messageCount: 0
      };
      
      setChats(prev => [newChat, ...prev]);
      setActiveChat(newSessionId);
      setSessionId(newSessionId);
      
      processedMessages.current.clear();
      
      setMessages([
        { 
          id: `welcome-${newSessionId}-${Date.now()}`, 
          type: 'system', 
          sender: 'system',
          content: 'Hello! I\'m your RAG-powered news chatbot. Ask me about any recent news, current events, or topics you\'re curious about!', 
          timestamp: formatTimestamp()
        }
      ]);

      if (isMobile) {
        setIsSidebarOpen(false);
      }
    }
  };

  const handleClearSession = async () => {
    if (socket && isConnected) {
      socket.clearSession(sessionId);
    } else {
      // Fallback to REST API
      try {
        await apiService.clearSessionCache(sessionId);
        processedMessages.current.clear();
        setMessages([
          { 
            id: `system-cleared-${Date.now()}`, 
            type: 'system', 
            sender: 'system',
            content: 'Session cleared! I\'m ready for a fresh conversation. What would you like to know about current news?', 
            timestamp: formatTimestamp()
          }
        ]);
        updateChatLastMessage(sessionId, 'Session cleared');
      } catch (error) {
        console.error('Error clearing session:', error);
      }
    }
  };

  const handleChatSelect = async (chatId) => {
    if (chatId === activeChat) return; // Don't reload if same chat
    
    setActiveChat(chatId);
    setSessionId(chatId);
    
    // Clear processed messages for new session
    processedMessages.current.clear();
    
    // Load chat history
    await loadChatHistory(chatId);
    
    // Join session if socket is connected
    if (socket && isConnected) {
      socket.joinSession(chatId);
    }

    // Close sidebar on mobile after selecting chat
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteSession(chatId);
      
      // Remove from local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));
      
      // If deleted chat was active, switch to another chat or create new one
      if (chatId === activeChat) {
        const remainingChats = chats.filter(chat => chat.id !== chatId);
        if (remainingChats.length > 0) {
          const newActiveChat = remainingChats[0];
          setActiveChat(newActiveChat.id);
          setSessionId(newActiveChat.id);
          processedMessages.current.clear();
          await loadChatHistory(newActiveChat.id);
        } else {
          // No chats left, create a new one
          await handleNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete session:', error);
    }
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
        onDeleteChat={handleDeleteChat}
        isOpen={isSidebarOpen}
        isMobile={isMobile}
        onClose={closeSidebar}
        isLoading={isLoadingSessions}
        onRefreshSessions={loadSessions}
      />
      
      <MainContent
        messages={messages}
        inputMessage={inputMessage}
        setInputMessage={handleInputChange}
        isLoading={isLoading || isLoadingHistory}
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
        statusUpdate={statusUpdate}
        sessionTitle={chats.find(chat => chat.id === activeChat)?.title || 'Chat'}
      />
    </div>
  );
};

export default RAGNewsChatBot;