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
      label: "Tesla",
      query:
        "All articles about Tesla from the last month, sorted by most recent first?",
    },
    {
      label: "Economy & Markets",
      query: "Recent economic developments, market trends, and financial news?",
    },
    {
      label: "Innovation Trends",
      query:
        "Emerging trends, innovations, and breakthrough ideas across industries?",
    },
    {
      label: "Apple News",
      query:
        "Latest news, product updates, and innovations from Apple, sorted by recent first?",
    },
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
