import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import './ConnectionStatus.scss';

const ConnectionStatus = ({ isConnected, isConnecting, connectionError, onReconnect }) => {
  if (isConnected) {
    return (
      <div className="connection-status connected">
        <Wifi size={14} />
        <span>Connected</span>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="connection-status connecting">
        <RefreshCw size={14} className="spinning" />
        <span>Connecting...</span>
      </div>
    );
  }

  return (
    <div className="connection-status disconnected">
      <WifiOff size={14} />
      <span>Disconnected</span>
      {connectionError && (
        <span className="error-text">({connectionError})</span>
      )}
      <button className="reconnect-btn" onClick={onReconnect}>
        Reconnect
      </button>
    </div>
  );
};

export default ConnectionStatus;