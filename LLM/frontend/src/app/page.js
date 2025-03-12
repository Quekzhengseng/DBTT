"use client";

import { useEffect, useState } from "react";
import ChatInterface from "@/components/ChatInterface";
import Sidebar from "@/components/Sidebar";

export default function Home() {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  // Fetch conversations on initial load
  useEffect(() => {
    const fetchConversations = async () => {
      try {
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
          message_count: 0,
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
      <div className="flex items-center justify-center h-screen">
        <div className="loading-dots">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Sidebar
        conversations={conversations}
        currentConversation={currentConversation}
        onSelectConversation={handleConversationSelect}
        onNewConversation={createNewConversation}
        showUpload={showUpload}
        toggleUpload={toggleUpload}
      />
      <ChatInterface conversationId={currentConversation} />
    </div>
  );
}
