import React from "react";
import { Bot, RotateCcw, Menu, X } from "lucide-react";
import ConnectionStatus from "../ConnectionStatus/ConnectionStatus";
import "./ChatHeader.scss";

const ChatHeader = ({
  onClearSession,
  onToggleSidebar,
  isSidebarOpen,
  isMobile,
  connectionStatus,
}) => {
  return (
    <div className="chat-header">
      <div className="header-left">
        {isMobile && (
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}

        <div className="header-info">
          <Bot className="header-icon" />
          <div className="header-text">
            <h2>RAG News ChatBot</h2>
            <div className="status-container">
              <ConnectionStatus {...connectionStatus} />
              <span className="status-divider">•</span>
              <span className="status">
                Powered by Gemini AI & Vector Search
              </span>
            </div>
          </div>
        </div>
      </div>

      <button className="clear-session-btn" onClick={onClearSession}>
        <RotateCcw size={16} />
        <span className="btn-text">Clear Session</span>
      </button>
    </div>
  );
};

export default ChatHeader;
