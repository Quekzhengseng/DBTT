export default function MessageBubble({ message }) {
  const isUser = message.role === "user";

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="message-bubble">
        <div className="message-content">{message.content}</div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="message-sources">
            <div className="sources-label">Sources:</div>
            <ul className="source-list">
              {message.sources.map((source, index) => (
                <li key={index} className="source-list-item">
                  <span className="source-list-name">{source.name}</span>
                  {source.preview && (
                    <span className="source-list-preview">
                      {source.preview}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  );
}
