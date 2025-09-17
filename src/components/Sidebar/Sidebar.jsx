import React from 'react';
import { MessageCircle, Plus, Newspaper } from 'lucide-react';
import './Sidebar.scss';

const Sidebar = ({ chats, activeChat, onNewChat, onChatSelect, isOpen, isMobile, onClose }) => {
  const handleChatSelect = (chatId) => {
    onChatSelect(chatId);
    if (isMobile) {
      onClose();
    }
  };

  const handleNewChat = () => {
    onNewChat();
    if (isMobile) {
      onClose();
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Newspaper className="logo-icon" />
          <span>RAG NewsBot</span>
        </div>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="chat-list">
        <h3>Chat Sessions</h3>
        {chats.map(chat => (
          <div 
            key={chat.id} 
            className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
            onClick={() => handleChatSelect(chat.id)}
          >
            <div className="chat-icon">
              <MessageCircle size={16} />
            </div>
            <div className="chat-content">
              <div className="chat-title">{chat.title}</div>
              <div className="chat-preview">{chat.lastMessage}</div>
              <div className="chat-time">{chat.timestamp}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;