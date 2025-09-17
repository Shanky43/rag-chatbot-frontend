import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Database, Search, Star, ExternalLink } from 'lucide-react';
import './MessageMetadata.scss';

const MessageMetadata = ({ metadata }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!metadata) return null;

  const { source, searchStep, totalFound, sourceDetails, sourcesConsidered } = metadata;

  return (
    <div className="message-metadata">
      <button 
        className="metadata-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="metadata-summary">
          <Database size={12} />
          <span>Source: {source}</span>
          {totalFound && <span>• Found {totalFound} articles</span>}
          {sourceDetails?.similarity && (
            <span className="similarity">• {sourceDetails.similarity} match</span>
          )}
        </div>
        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isExpanded && (
        <div className="metadata-details">
          <div className="metadata-stats">
            <div className="stat-item">
              <Search size={12} />
              <span>Search Step: {searchStep}</span>
            </div>
            {sourcesConsidered && (
              <div className="stat-item">
                <span>Sources Considered: {sourcesConsidered}</span>
              </div>
            )}
          </div>

          {sourceDetails && (
            <div className="source-details">
              <h4>Primary Source</h4>
              <div className="source-card">
                {sourceDetails.urlToImage && (
                  <img 
                    src={sourceDetails.urlToImage} 
                    alt={sourceDetails.title}
                    className="source-image"
                  />
                )}
                <div className="source-info">
                  <h5>{sourceDetails.title}</h5>
                  {sourceDetails.author && (
                    <p className="source-author">By {sourceDetails.author}</p>
                  )}
                  {sourceDetails.source_name && (
                    <p className="source-publication">{sourceDetails.source_name}</p>
                  )}
                  {sourceDetails.published_at && (
                    <p className="source-date">
                      {new Date(sourceDetails.published_at).toLocaleDateString()}
                    </p>
                  )}
                  <div className="source-metrics">
                    {sourceDetails.score && (
                      <div className="metric">
                        <Star size={12} />
                        <span>Score: {(sourceDetails.score * 100).toFixed(1)}%</span>
                      </div>
                    )}
                    {sourceDetails.similarity && (
                      <div className="metric">
                        <span>Similarity: {sourceDetails.similarity}</span>
                      </div>
                    )}
                  </div>
                  {sourceDetails.url && (
                    <a 
                      href={sourceDetails.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="source-link-btn"
                    >
                      <ExternalLink size={12} />
                      Read Full Article
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageMetadata;