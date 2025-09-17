import React from 'react';
import TrendingTopics from '../TrendingTopics/TrendingTopics';
import MessageInput from '../MessageInput/MessageInput';
import './InputContainer.scss';

const InputContainer = ({ inputMessage, setInputMessage, isLoading, onSendMessage }) => {
  const handleTopicClick = (query) => {
    setInputMessage(query);
  };

  return (
    <div className="input-container">
      <TrendingTopics onTopicClick={handleTopicClick} />
      
      <MessageInput
        inputMessage={inputMessage}
        setInputMessage={setInputMessage}
        isLoading={isLoading}
        onSendMessage={onSendMessage}
      />
    </div>
  );
};

export default InputContainer;