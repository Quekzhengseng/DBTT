"use client";

import { useState, useEffect } from "react";
import FileUpload from "./FileUpload";

export default function Sidebar({
  conversations,
  currentConversation,
  onSelectConversation,
  onNewConversation,
  showUpload,
  toggleUpload,
}) {
  const [sources, setSources] = useState([]);

  useEffect(() => {
    if (showUpload) {
      fetchSources();
    }
  }, [showUpload]);

  const fetchSources = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/files/sources");
      if (response.ok) {
        const data = await response.json();
        setSources(data);
      }
    } catch (error) {
      console.error("Failed to fetch sources:", error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="sidebar">
      <div className="app-header">
        <h1 className="app-title">Travel Assistant</h1>
      </div>

      <div className="action-buttons">
        <button
          onClick={() => onNewConversation("New Conversation")}
          className="btn btn-primary"
        >
          New Conversation
        </button>
        <button onClick={toggleUpload} className="btn btn-secondary">
          {showUpload ? "Hide Upload" : "Upload Documents"}
        </button>
      </div>

      {showUpload && (
        <div className="upload-section">
          <FileUpload onUploadSuccess={fetchSources} />

          <div className="sources-list">
            <h3 className="upload-heading">Knowledge Sources</h3>
            {sources.length === 0 ? (
              <p className="text-sm text-gray-500">No documents uploaded yet</p>
            ) : (
              <ul>
                {sources.map((source, index) => (
                  <li key={index} className="source-item">
                    <span className="source-name">{source.name}</span>
                    <span className="source-chunks">
                      {source.chunks} chunks
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      <h2 className="conversations-heading">Conversations</h2>
      <div className="conversations-list">
        {conversations.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No conversations yet</div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`conversation-item ${
                currentConversation === conversation.id ? "active" : ""
              }`}
            >
              <div className="conversation-title">{conversation.title}</div>
              <div className="conversation-meta">
                <span>{formatDate(conversation.updated_at)}</span>
                <span>{conversation.message_count} messages</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
