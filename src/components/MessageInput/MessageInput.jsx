import React from 'react';
import { Send } from 'lucide-react';
import './MessageInput.scss';

const MessageInput = ({ inputMessage, setInputMessage, isLoading, onSendMessage }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="input-wrapper">
      <textarea
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Curious about something? Let’s find the latest updates..."
        rows="1"
        className="message-input"
        disabled={isLoading}
      />
      <button 
        onClick={() => onSendMessage()}
        className={`send-btn ${inputMessage.trim() ? 'active' : ''}`}
        disabled={!inputMessage.trim() || isLoading}
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;