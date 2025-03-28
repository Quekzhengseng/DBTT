import { FileText, Clock, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

export default function MessageBubble({ message }) {
  // State to track image loading errors
  const [mainImageError, setMainImageError] = useState(false);

  // Add null check to handle undefined message prop
  if (!message) {
    return null; // Return nothing if message is undefined
  }

  const isUser = message.role === "user";

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Handle image error
  const handleImageError = () => {
    setMainImageError(true);
  };

  return (
    <div 
      style={{
        display: "flex",
        width: "100%",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "1rem",
        paddingLeft: isUser ? "5%" : "0", // Reduces space on the left for user messages
        paddingRight: !isUser ? "5%" : "0" // Reduces space on the right for assistant messages
      }}
    >
      <div 
        style={{
          backgroundColor: isUser ? "#3eafdb" : "#ecf9fd",
          color: isUser ? "white" : "#333",
          borderRadius: "1rem",
          borderTopRightRadius: isUser ? 0 : "1rem",
          borderTopLeftRadius: isUser ? "1rem" : 0,
          maxWidth: "75%", // Allow the bubble to use its available space
          boxShadow: "0 1px 2px rgba(0,0,0,0.1)"
        }}
      >
        <div style={{ padding: "0.75rem 1rem" }}>
          <div style={{ whiteSpace: "pre-wrap" }}>
            {message.content || ""}
          </div>

          {/* Handle image display for assistant messages */}
          {!isUser && message.image && (
            <div style={{ 
              marginTop: "1rem", 
              borderRadius: 0, 
              overflow: "hidden", 
              maxWidth: "100%",
              border: "0px solid rgba(0,0,0,0.1)"
            }}>
              {mainImageError ? (
                <div style={{ 
                  width: "100%", 
                  height: "auto", // Changed to auto height
                  backgroundColor: "#f0f0f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "40px 0"
                }}>
                  <div style={{ textAlign: "center" }}>
                    <ImageIcon size={40} style={{ color: "#aaa", margin: "0 auto" }} />
                    <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "8px" }}>
                      {message.image.alt || "Image not available"}
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ width: "100%", maxHeight:"450px", overflow:'hidden' }}> {/* Removed fixed height to prevent cropping */}
                  <img
                    src={message.image.url} 
                    alt={message.image.alt || "Travel image"}
                    style={{ 
                      width: "100%", 
                      maxHeight: "350px", // Let the image determine its height
                      objectFit:"contain", // changed to contain to show full image without cropping
                      display: "block" ,// Remove any extra space
                      margin: "0 auto" // center image
                    }}
                    onError={handleImageError}
                  />
                </div>
              )}
              {message.image.caption && (
                <div style={{ 
                  padding: "0.75rem", 
                  backgroundColor: "rgba(0,0,0,0.03)", 
                  fontSize: "0.875rem",
                  color: "#22337c",
                  lineHeight: "1.4"
                }}>
                  {message.image.caption}
                </div>
              )}
            </div>
          )}

          {!isUser && message.sources && message.sources.length > 0 && (
            <div style={{ 
              marginTop: "0.75rem", 
              paddingTop: "0.75rem", 
              borderTop: "1px solid rgba(0,0,0,0.1)",
              fontSize: "0.75rem"
            }}>
              <div style={{ 
                fontWeight: "600", 
                marginBottom: "0.25rem", 
                display: "flex", 
                alignItems: "center",
                color: isUser ? "rgba(255,255,255,0.8)" : "#22337c"
              }}>
                <FileText size={12} style={{ marginRight: "0.25rem" }} />
                Sources:
              </div>
              <ul style={{ marginTop: "0.25rem" }}>
                {message.sources.map((source, index) => (
                  <li key={index} style={{ display: "flex", marginBottom: "0.25rem" }}>
                    <span style={{ 
                      fontWeight: "500",
                      color: isUser ? "rgba(255,255,255,0.9)" : "#22337c" 
                    }}>
                      {source.name || "Unknown"}
                    </span>
                    {source.preview && (
                      <span style={{ 
                        marginLeft: "0.25rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        color: isUser ? "rgba(255,255,255,0.7)" : "gray"
                      }}>
                        {source.preview}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ 
            fontSize: "0.75rem", 
            marginTop: "0.5rem", 
            display: "flex", 
            alignItems: "center",
            color: isUser ? "rgba(255,255,255,0.5)" : "gray",
            justifyContent: isUser ? "flex-end" : "flex-start"
          }}>
            <Clock size={12} style={{ marginRight: "0.25rem" }} />
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    </div>
  );
}