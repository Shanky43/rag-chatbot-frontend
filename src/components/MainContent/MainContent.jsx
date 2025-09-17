import React from 'react';
import ChatHeader from '../ChatHeader/ChatHeader';
import MessagesContainer from '../MessagesContainer/MessagesContainer';
import InputContainer from '../InputContainer/InputContainer';
import './MainContent.scss';

const MainContent = ({ 
  messages, 
  inputMessage, 
  setInputMessage, 
  isLoading, 
  onSendMessage, 
  onClearSession,
  onToggleSidebar,
  isSidebarOpen,
  isMobile,
  connectionStatus,
  typingUsers
}) => {
  return (
    <div className={`main-content ${isMobile ? 'mobile' : 'desktop'}`}>
      <ChatHeader 
        onClearSession={onClearSession}
        onToggleSidebar={onToggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isMobile={isMobile}
        connectionStatus={connectionStatus}
      />
      
      <MessagesContainer 
        messages={messages} 
        isLoading={isLoading}
        typingUsers={typingUsers}
      />
      
      <InputContainer
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default MainContent;