import React, { useEffect, useRef } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Bot } from "lucide-react";
import "./MessagesContainer.scss";
import botAnimation from "../../assets/bot-animation.gif";

const MessagesContainer = ({ messages, isLoading, typingUsers, statusUpdate }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, statusUpdate]);

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {/* ENHANCED: Status Update Display - Shows engaging loading messages */}
      {statusUpdate && statusUpdate.visible && (
        <div className="message bot status-update">
          <div className="message-avatar">
            <img src={botAnimation} alt="Bot animation" />
          </div>
          <div className="message-content">
            <div className="status-message">
              <LoadingSpinner />
              <span className="status-text">{statusUpdate.message}</span>
            </div>
          </div>
        </div>
      )}

      {/* FALLBACK: Generic loading when no specific status update */}
      {isLoading && !statusUpdate && (
        <div className="message bot loading">
          <div className="message-avatar">
            <img src={botAnimation} alt="Bot animation" />
          </div>
          <div className="message-content">
            <div className="loading-message">
              <LoadingSpinner />
              <span>Processing your request...</span>
            </div>
          </div>
        </div>
      )}

      {/* Typing indicator for other users */}
      {typingUsers.length > 0 && (
        <div className="message bot typing">
          <div className="message-avatar">
            <img src={botAnimation} alt="Bot animation" />
          </div>
          <div className="message-content">
            <div className="typing-indicator">
              <div className="typing-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <span>AI is typing...</span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessagesContainer;