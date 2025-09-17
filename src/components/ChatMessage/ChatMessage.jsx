import React from "react";
import { Bot, User } from "lucide-react";
import MessageMetadata from "../MessageMetadata/MessageMetadata";
import "./ChatMessage.scss";
import botAnimation from "../../assets/bot-animation.gif";
import userAvatar from "../../assets/user-avatar.gif";
import "@lottiefiles/lottie-player";

const ChatMessage = ({ message }) => {
  let avatar;

  if (message.type === "assistant") {
    avatar = <img src={botAnimation} alt="Assistant animation" />;
  } else if (message.type === "system") {
    avatar = <img src={botAnimation} alt="System animation" />;
  } else if (message.type === "bot") {
    avatar = <img src={botAnimation} alt="Bot animation" />;
  } else {
    avatar = <img src={userAvatar} alt="Bot animation" />;
  }
  return (
    <div className={`message ${message.type}`}>
      <div className="message-avatar">{avatar}</div>
      <div className="message-content">
        {/* <div className="message-text">{message.content}</div> */}
        <div
          dangerouslySetInnerHTML={{ __html: message.content }}
          className="message-text"
        />
        {message.metadata && <MessageMetadata metadata={message.metadata} />}
        {message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <strong>📰 Sources:</strong>
            {message.sources.map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-link"
              >
                {source.title}
              </a>
            ))}
          </div>
        )}
        <div className="message-time">
          {message.timestamp && !isNaN(new Date(message.timestamp).getTime())
            ? new Date(message.timestamp).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "Asia/Kolkata",
              })
            : null}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
