// import React from 'react';
// import { MessageCircle, Plus, Newspaper } from 'lucide-react';
// import './Sidebar.scss';

// const Sidebar = ({ chats, activeChat, onNewChat, onChatSelect, isOpen, isMobile, onClose }) => {
//   const handleChatSelect = (chatId) => {
//     onChatSelect(chatId);
//     if (isMobile) {
//       onClose();
//     }
//   };

//   const handleNewChat = () => {
//     onNewChat();
//     if (isMobile) {
//       onClose();
//     }
//   };

//   return (
//     <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
//       <div className="sidebar-header">
//         <div className="logo">
//           <Newspaper className="logo-icon" />
//           <span>RAG NewsBot</span>
//         </div>
//         <button className="new-chat-btn" onClick={handleNewChat}>
//           <Plus size={16} />
//           New Chat
//         </button>
//       </div>

//       <div className="chat-list">
//         <h3>Chat Sessions</h3>
//         {chats.map(chat => (
//           <div 
//             key={chat.id} 
//             className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
//             onClick={() => handleChatSelect(chat.id)}
//           >
//             <div className="chat-icon">
//               <MessageCircle size={16} />
//             </div>
//             <div className="chat-content">
//               <div className="chat-title">{chat.title}</div>
//               <div className="chat-preview">{chat.lastMessage}</div>
//               <div className="chat-time">{chat.timestamp}</div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react';
import { MessageCircle, Plus, Newspaper, MoreVertical, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import './Sidebar.scss';

const Sidebar = ({ 
  chats, 
  activeChat, 
  onNewChat, 
  onChatSelect, 
  onDeleteChat,
  isOpen, 
  isMobile, 
  onClose, 
  isLoading,
  onRefreshSessions 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showContextMenu, setShowContextMenu] = useState(null);

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

  const handleDeleteClick = (chatId, event) => {
    event.stopPropagation();
    setShowDeleteConfirm(chatId);
    setShowContextMenu(null);
  };

  const confirmDelete = (chatId) => {
    onDeleteChat(chatId);
    setShowDeleteConfirm(null);
  };

  const toggleContextMenu = (chatId, event) => {
    event.stopPropagation();
    setShowContextMenu(showContextMenu === chatId ? null : chatId);
  };

  const handleRefresh = () => {
    onRefreshSessions();
  };

  // Close context menu when clicking elsewhere
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowContextMenu(null);
      setShowDeleteConfirm(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''} ${isMobile ? 'mobile' : 'desktop'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <Newspaper className="logo-icon" />
          <span>RAG NewsBot</span>
        </div>
        <button className="new-chat-btn" onClick={handleNewChat} disabled={isLoading}>
          <Plus size={16} />
          New Chat
        </button>
      </div>

      <div className="chat-list">
        <div className="chat-list-header">
          <h3>Chat Sessions</h3>
          <button 
            className="refresh-btn" 
            onClick={handleRefresh}
            disabled={isLoading}
            title="Refresh sessions"
          >
            <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
          </button>
        </div>

        {isLoading ? (
          <div className="loading-sessions">
            <div className="loading-spinner">
              <RefreshCw size={20} className="spinning" />
            </div>
            <span>Loading sessions...</span>
          </div>
        ) : chats.length === 0 ? (
          <div className="empty-state">
            <MessageCircle size={32} />
            <p>No chat sessions yet</p>
            <span>Start a new conversation to get started!</span>
          </div>
        ) : (
          chats.map(chat => (
            <div key={chat.id} className="chat-item-wrapper">
              <div 
                className={`chat-item ${activeChat === chat.id ? 'active' : ''}`}
                onClick={() => handleChatSelect(chat.id)}
              >
                <div className="chat-icon">
                  <MessageCircle size={16} />
                </div>
                <div className="chat-content">
                  <div className="chat-title"   dangerouslySetInnerHTML={{ __html: chat.title }}/>
                  <div className="chat-preview" dangerouslySetInnerHTML={{ __html: chat.lastMessage || 'No messages yet' }}/>
                  
                  <div className="chat-meta">
                    <span className="chat-time">{chat.timestamp}</span>
                    {chat.messageCount > 0 && (
                      <span className="message-count">{chat.messageCount} messages</span>
                    )}
                  </div>
                </div>
                <div className="chat-actions">
                  <button 
                    className="context-menu-btn"
                    onClick={(e) => toggleContextMenu(chat.id, e)}
                  >
                    <MoreVertical size={14} />
                  </button>
                </div>

                {/* Context Menu */}
                {showContextMenu === chat.id && (
                  <div className="context-menu" onClick={(e) => e.stopPropagation()}>
                    <button 
                      className="context-menu-item delete"
                      onClick={(e) => handleDeleteClick(chat.id, e)}
                    >
                      <Trash2 size={14} />
                      Delete Chat
                    </button>
                  </div>
                )}
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm === chat.id && (
                <div className="delete-confirmation" onClick={(e) => e.stopPropagation()}>
                  <div className="delete-modal">
                    <div className="delete-icon">
                      <AlertTriangle size={20} />
                    </div>
                    <h4>Delete Chat?</h4>
                    <p>This will permanently delete this chat session and all its messages.</p>
                    <div className="delete-actions">
                      <button 
                        className="btn-cancel"
                        onClick={() => setShowDeleteConfirm(null)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => confirmDelete(chat.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;