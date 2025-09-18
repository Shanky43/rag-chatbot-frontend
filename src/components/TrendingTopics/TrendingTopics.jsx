import "./TrendingTopics.scss";

const TrendingTopics = ({ onTopicClick }) => {
  const trendingTopics = [
    {
      label: "AI & Tech",
      query:
        "Latest advancements and breakthroughs in artificial intelligence and technology?",
    },
    {
      label: "Global Sports",
      query:
        "Top sports news, match results, and highlights from around the world?",
    },
  {
    label: "Entertainment",
    query: "Breaking news on movies, TV shows, music, and celebrity updates",
  },
  {
    label: "Environment",
    query: "Latest news on climate change, conservation, and environmental policies",
  },
  {
    label: "Travel & Tourism",
    query: "Updates on travel destinations, tourism trends, and global travel news",
  }
 
  ];

  return (
    <div className="trending-topics">
      <div className="trending-header">
        <span>🔥 Trending Topics</span>
      </div>
      <div className="topics-grid">
        {trendingTopics.map((topic, index) => (
          <button
            key={index}
            className={`topic-chip`}
            onClick={() => onTopicClick(topic.query)}
          >
            {topic.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTopics;
