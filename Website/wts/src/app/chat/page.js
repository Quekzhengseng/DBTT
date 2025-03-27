"use client";

import { useEffect, useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "../../components/Sidebar";
import { Loader2 } from "lucide-react";
import Link from "next/link"; // Import Link for navigation

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [conversationsUpdateTrigger, setConversationsUpdateTrigger] =
    useState(0);

  // Fetch conversations on initial load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "http://localhost:5001/api/chat/conversations"
        );
        if (response.ok) {
          const data = await response.json();
          setConversations(data);

          // Set the most recent conversation as current, or create a new one if none exist
          if (data.length > 0) {
            setCurrentConversation(data[0].id);
          } else {
            createNewConversation();
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const createNewConversation = async (title = "New Conversation") => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (response.ok) {
        const data = await response.json();
        const newConversation = {
          id: data.conversation_id,
          title,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversation(data.conversation_id);
      }
    } catch (error) {
      console.error("Failed to create new conversation:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConversationSelect = (conversationId) => {
    setCurrentConversation(conversationId);
  };

  const toggleUpload = () => {
    setShowUpload(!showUpload);
  };

  if (loading && conversations.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          width: "100%",
          backgroundColor: "white",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "350px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              marginBottom: "1rem",
              margin: "0 auto 1rem auto",
            }}
          >
            <Loader2
              style={{
                width: "32px",
                height: "32px",
                color: "#3eafdb",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: 500,
              color: "#22337c",
              marginBottom: "0.5rem",
            }}
          >
            Loading WTS Travel Assistant
          </h2>
          <p style={{ color: "#6b7280" }}>
            Please wait while we prepare your experience
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Back to Home button with inline CSS */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 10,
        }}
      >
        <Link href="/">
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "white",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
              border: "none",
              cursor: "pointer",
              color: "#333",
              fontWeight: 500,
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#f5f5f5")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "white")
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Home
          </button>
        </Link>
      </div>

      {/* Sidebar component with conversation history and controls */}
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={handleConversationSelect}
        onNewConversation={createNewConversation}
        showUpload={showUpload}
        toggleUpload={toggleUpload}
        conversationsUpdateTrigger={conversationsUpdateTrigger}
      />

      {/* Main chat interface */}
      <ChatInterface
        conversationId={currentConversation}
        onMessageSent={() => setConversationsUpdateTrigger((prev) => prev + 1)}
      />
    </div>
  );
}
