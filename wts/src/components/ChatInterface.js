"use client";

import { useState, useEffect, useRef } from "react";
import { Plane, Loader2, Image as ImageIcon } from "lucide-react";
import MessageBubble from "./MessageBubble";
import Image from "next/image";

export default function ChatInterface({ conversationId, onMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [pendingComplaint, setPendingComplaint] = useState(null);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Fetch conversation history when conversationId changes
  useEffect(() => {
    if (conversationId) {
      fetchMessages();
      setError(null);
      // Focus input field after loading messages
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
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
      } else {
        setError("Failed to load conversation history");
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setError("Network error while loading messages");
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
    setError(null);

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
        console.log("Response data:", data); // Debug output

        // Handle the case where the system is requesting more details for a complaint
        if (data.requesting_details) {
          // Save the complaint information so we can send it back with the user's response
          setPendingComplaint({
            intent: data.intent,
            urgency: data.urgency,
          });

          // Save any user details already collected
          if (data.collected_data) {
            setUserDetails((prevDetails) => ({
              ...prevDetails,
              ...data.collected_data,
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
          sources: data.sources || [],
          timestamp: new Date().toISOString(),
          // Include image data if it exists in the response
          image: data.image || null,
          // New field for additional images
          additionalImages: data.additional_images || [],
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Notify parent component that a message was sent successfully
        if (onMessageSent) {
          onMessageSent();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to send message");
        // Remove optimistic message on error
        setMessages((prev) => prev.filter((msg) => msg !== userMessage));
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setError("Network error occurred");
      // Remove optimistic message on error
      setMessages((prev) => prev.filter((msg) => msg !== userMessage));
    } finally {
      setLoading(false);
      // Focus input field after sending
      inputRef.current?.focus();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleKeyDown = (e) => {
    // Submit form on Shift+Enter
    if (e.key === "Enter" && e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  // Empty chat state when no conversation is selected
  if (!conversationId) {
    return (
      <div
        ref={chatContainerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "calc(100vh - 80px)", // Account for input height
          backgroundColor: "white",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Plane
            style={{
              width: "64px",
              height: "64px",
              color: "#22337c",
            }}
          />
        </div>
        <h3
          style={{
            fontSize: "1.75rem",
            fontWeight: "500",
            marginBottom: "1rem",
            color: "#22337c",
            textAlign: "center",
          }}
        >
          Start Your Travel Conversations
        </h3>
        <p
          style={{
            color: "#4b5563",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            textAlign: "center",
            maxWidth: "600px",
          }}
        >
          Ask questions about destinations, attractions, travel packages, or get
          assistance with your booking.
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatContainerRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        left: "320px", // Account for sidebar
        right: 0,
        bottom: 0,
      }}
    >
      {/* Messages container - Added padding at the top and sides */}
      <div
        ref={messagesContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 24px 80px 24px", // Increased padding on all sides
          paddingBottom: "80px", // Extra bottom padding for input box
          marginBottom: "64px", // Space for input
          width: "100%",
        }}
      >
        {messages.length === 0 && !loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "calc(100vh - 180px)", // Adjusted height calculation
              padding: "0 16px",
              marginTop: "-80px", // Pull it up slightly to center in the available space
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Plane
                style={{
                  width: "64px",
                  height: "64px",
                  color: "#22337c",
                }}
              />
            </div>
            <h3
              style={{
                fontSize: "1.75rem",
                fontWeight: "500",
                marginBottom: "1rem",
                color: "#22337c",
                textAlign: "center",
              }}
            >
              Start Your Travel Conversations
            </h3>
            <p
              style={{
                color: "#4b5563",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                textAlign: "center",
                maxWidth: "600px",
              }}
            >
              Ask questions about destinations, attractions, travel packages, or
              get assistance with your booking.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px", // Added space between messages
              maxWidth: "900px",
              margin: "0 auto",
              paddingTop: "8px", // Extra padding at top of messages list
              width: "100%",
            }}
          >
            {messages.map((message, index) => (
              // Pass entire message to MessageBubble including potential image data
              <MessageBubble key={index} message={message} />
            ))}

            {loading && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  marginTop: "8px",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#ecf9fd",
                    borderRadius: "0.5rem",
                    padding: "0.75rem 1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      border: "2px solid #3eafdb",
                      borderTopColor: "transparent",
                      animation: "spin 1s linear infinite",
                    }}
                  ></div>
                  <span style={{ color: "#4b5563" }}>
                    WTS Travel Assistant is typing...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area - Fixed position with content-aligned width */}
      <div
        style={{
          padding: "12px 16px",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "white",
          position: "fixed",
          bottom: 0,
          left: "320px", // Align with sidebar width
          right: 0,
          zIndex: 10,
        }}
      >
        <form
          onSubmit={handleSendMessage}
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              gap: "0.5rem",
            }}
          >
            <div style={{ position: "relative", flex: 1, width: "100%" }}>
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask questions about destinations, attractions, travel packages or get assistance with your booking"
                style={{
                  width: "100%",
                  padding: "0.875rem 1rem",
                  borderRadius: "9999px",
                  border: "1px solid #e5e7eb",
                  outline: "none",
                  fontSize: "0.9375rem",
                }}
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !inputMessage.trim()}
              style={{
                backgroundColor: "#22337c",
                color: "white",
                borderRadius: "9999px",
                padding: "0.75rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                cursor:
                  loading || !inputMessage.trim() ? "not-allowed" : "pointer",
                opacity: loading || !inputMessage.trim() ? 0.5 : 1,
              }}
              aria-label="Send message"
            >
              {loading ? (
                <Loader2
                  style={{
                    width: "1.25rem",
                    height: "1.25rem",
                    animation: "spin 1s linear infinite",
                  }}
                />
              ) : (
                <Plane style={{ width: "1.25rem", height: "1.25rem" }} />
              )}
            </button>
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              textAlign: "center",
              marginTop: "0.5rem",
              color: "#6b7280",
            }}
          >
            Press Shift+Enter to send your message quickly
          </div>
        </form>
      </div>
    </div>
  );
}
