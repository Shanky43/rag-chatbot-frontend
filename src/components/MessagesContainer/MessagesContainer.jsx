import React, { useEffect, useRef } from "react";
import ChatMessage from "../ChatMessage/ChatMessage";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Bot } from "lucide-react";
import "./MessagesContainer.scss";
import botAnimation from "../../assets/bot-animation.gif";


const MessagesContainer = ({ messages, isLoading, typingUsers }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="message bot loading">
          <div className="message-avatar">
            <img src={botAnimation} alt="My animation" />
          </div>
          <div className="message-content">
            <div className="loading-message">
              <LoadingSpinner />
              <span>Searching news corpus and generating response...</span>
            </div>
          </div>
        </div>
      )}

      {typingUsers.length > 0 && (
        <div className="message bot typing">
          <div className="message-avatar">
            <img src={botAnimation} alt="My animation" />
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
