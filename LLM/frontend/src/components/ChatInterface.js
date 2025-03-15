"use client";

import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

export default function ChatInterface({ conversationId }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [pendingComplaint, setPendingComplaint] = useState(null);
  const messagesEndRef = useRef(null);

  // Fetch conversation history when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5001/api/chat/history/${conversationId}`
      );
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !conversationId) return;

    // Optimistically add user message to UI
    const userMessage = {
      role: "user",
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");

    try {
      setLoading(true);
      
      // Include any collected user details if we're in the middle of processing a complaint
      const requestBody = {
        message: inputMessage,
        conversation_id: conversationId,
      };
      
      // If we have pending complaint data, include it
      if (pendingComplaint) {
        // Update user details with any new information from the input message
        const updatedUserDetails = {
          ...userDetails,
          // If the message might contain details requested previously
          user_message: inputMessage,
        };
        
        requestBody.user_data = updatedUserDetails;
        requestBody.intent = pendingComplaint.intent;
        requestBody.urgency = pendingComplaint.urgency;
      }

      const response = await fetch("http://localhost:5001/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle the case where the system is requesting more details for a complaint
        if (data.requesting_details) {
          // Save the complaint information so we can send it back with the user's response
          setPendingComplaint({
            intent: data.intent,
            urgency: data.urgency,
          });
          
          // Save any user details already collected
          if (data.collected_data) {
            setUserDetails(prevDetails => ({
              ...prevDetails,
              ...data.collected_data
            }));
          }
        } else if (data.ticket_created) {
          // If a ticket was created, clear the pending complaint state
          setPendingComplaint(null);
          setUserDetails({});
        }
        
        const assistantMessage = {
          role: "assistant",
          content: data.message,
          sources: data.sources,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg !== userMessage));
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (!conversationId) {
    return (
      <div className="chat-container">
        <div className="empty-chat">
          <div className="empty-chat-icon">💬</div>
          <div className="empty-chat-text">No conversation selected</div>
          <div className="empty-chat-subtext">
            Select or create a conversation to get started
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.length === 0 && !loading ? (
          <div className="empty-chat">
            <div className="empty-chat-icon">✈️</div>
            <div className="empty-chat-text">
              Start your travel conversation
            </div>
            <div className="empty-chat-subtext">
              Ask questions about destinations, attractions, or travel tips
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))
        )}
        {loading && (
          <div className="loading-dots">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input-container">
        <form onSubmit={handleSendMessage} className="message-form">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={pendingComplaint ? "Please provide the requested details..." : "Ask something about travel..."}
            className="message-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="send-button"
            disabled={loading || !inputMessage.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}