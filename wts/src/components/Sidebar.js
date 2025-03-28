"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Upload, Plus, Image } from "lucide-react";
import Link from "next/link";

export default function Sidebar({
  currentConversation,
  onSelectConversation,
  onNewConversation,
  showUpload,
  toggleUpload,
  conversationsUpdateTrigger,
}) {
  const [conversations, setConversations] = useState([]);
  const [groupedConversations, setGroupedConversations] = useState({
    today: [],
    yesterday: [],
    previousWeek: [],
    older: [],
  });
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetchConversations();
    fetchSources();

    // Check if mobile on initial load
    checkIfMobile();

    // Add resize listener
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, [conversationsUpdateTrigger]);

  useEffect(() => {
    // Group conversations by date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const grouped = {
      today: [],
      yesterday: [],
      previousWeek: [],
      older: [],
    };

    conversations.forEach((conv) => {
      const convDate = new Date(conv.updated_at);
      convDate.setHours(0, 0, 0, 0);

      if (convDate.getTime() === today.getTime()) {
        grouped.today.push(conv);
      } else if (convDate.getTime() === yesterday.getTime()) {
        grouped.yesterday.push(conv);
      } else if (convDate >= sevenDaysAgo) {
        grouped.previousWeek.push(conv);
      } else {
        grouped.older.push(conv);
      }
    });

    setGroupedConversations(grouped);
  }, [conversations]);

  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 768);
    // Auto-collapse on mobile
    if (window.innerWidth < 768) {
      setCollapsed(true);
    }
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5001/api/chat/conversations"
      );
      if (response.ok) {
        const data = await response.json();
        setConversations(data);
      }
    } catch (error) {
      console.error("Failed to fetch conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await fetch("http://localhost:5001/api/files/sources");
      if (response.ok) {
        const data = await response.json();
        setSources(data);
      }
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  };

  const renderConversationGroup = (title, conversations) => {
    if (!conversations || conversations.length === 0) return null;

    return (
      <div>
        <h3
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#4b5563",
          }}
        >
          {title}
        </h3>
        <div>
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => {
                onSelectConversation(conversation.id);
                if (isMobile) setCollapsed(true);
              }}
              style={{
                padding: "0.75rem 1rem",
                cursor: "pointer",
                backgroundColor:
                  currentConversation === conversation.id
                    ? "rgba(62, 175, 219, 0.1)"
                    : "transparent",
                borderLeft:
                  currentConversation === conversation.id
                    ? "3px solid #3eafdb"
                    : "3px solid transparent",
                transition: "background-color 0.2s ease",
              }}
            >
              <div
                style={{
                  fontWeight: "500",
                  fontSize: "0.9375rem",
                  color: "#1f2937",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {conversation.title || "New Conversation"}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        width: "320px",
        backgroundColor: "#ecf9fd",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #e5e7eb",
      }}
    >
      {/* Header with logo */}
      <div
        style={{
          padding: "1rem",
          borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <img src="/wts-logo.png" alt="WTS Travel" width={180} height={40} />
        </div>
        <h2
          style={{
            fontSize: "0.875rem",
            fontWeight: "500",
            color: "#4b5563",
            marginTop: "0.5rem",
          }}
        >
          Newest AI chatbot
        </h2>
      </div>

      {/* Action buttons */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={() => onNewConversation("New Conversation")}
          style={{
            backgroundColor: "#3eafdb",
            color: "white",
            border: "none",
            borderRadius: "9999px",
            padding: "0.75rem 1rem",
            fontSize: "0.9375rem",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <Plus size={18} />
          <span>New conversation</span>
        </button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <div style={{ padding: "0 1rem 1rem 1rem" }}>
          <FileUpload onUploadSuccess={fetchSources} />
        </div>
      )}

      {/* Past conversations header */}
      <div style={{ padding: "0 1rem", marginTop: "0.5rem" }}>
        <h2
          style={{
            fontSize: "1rem",
            fontWeight: "600",
            color: "#1f2937",
          }}
        >
          Past conversations
        </h2>
      </div>

      {/* Conversations List - Make sure this container is scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "0.5rem 0",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "0.25rem" }}>
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3eafdb",
                  borderRadius: "9999px",
                  animation: "bounce 1s infinite",
                }}
              ></div>
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3eafdb",
                  borderRadius: "9999px",
                  animation: "bounce 1s infinite",
                  animationDelay: "0.2s",
                }}
              ></div>
              <div
                style={{
                  width: "0.5rem",
                  height: "0.5rem",
                  backgroundColor: "#3eafdb",
                  borderRadius: "9999px",
                  animation: "bounce 1s infinite",
                  animationDelay: "0.4s",
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div>
            {renderConversationGroup("Today", groupedConversations.today)}
            {renderConversationGroup(
              "Yesterday",
              groupedConversations.yesterday
            )}
            {renderConversationGroup(
              "Previous 7 days",
              groupedConversations.previousWeek
            )}
            {renderConversationGroup(
              "Previous 30 days",
              groupedConversations.older
            )}

            {Object.values(groupedConversations).every(
              (group) => group.length === 0
            ) && (
              <div
                style={{
                  padding: "1rem",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "0.875rem",
                }}
              >
                No conversations yet
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "0.75rem 1rem",
          borderTop: "1px solid rgba(229, 231, 235, 0.5)",
          fontSize: "0.75rem",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        © 2025 WTS Travel & Tours
      </div>
    </div>
  );
}
