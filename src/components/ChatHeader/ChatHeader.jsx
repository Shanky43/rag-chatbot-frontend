import React from "react";
import { Bot, RotateCcw, Menu, X } from "lucide-react";
import ConnectionStatus from "../ConnectionStatus/ConnectionStatus";
import "./ChatHeader.scss";
import LiveCharbot from "../../assets/Livechatbot.gif";

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
         <img src={LiveCharbot} alt="Assistant animation" style={{
    width: "50px",
    height: "50px",
    transform: "scale(1.5)",
    transformOrigin: "center"
  }}/>
          <div className="header-text">
            <h2>RAG News ChatBot</h2>
            <div className="status-container">
              <ConnectionStatus {...connectionStatus} />
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
