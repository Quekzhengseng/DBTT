// src/components/FileUpload.js
"use client";

import { useState, useRef } from "react";

export default function FileUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef(null);
  const fileInputRef = useRef(null);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setUploadResults([]);
    }
  };

  // Prevent default behavior for all drag events
  const handleDragEvent = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle drag enter
  const handleDragEnter = (e) => {
    handleDragEvent(e);
    setIsDragging(true);
  };

  // Handle drag leave
  const handleDragLeave = (e) => {
    handleDragEvent(e);
    // Only set dragging to false if we're leaving the drop zone (not a child element)
    if (e.target === dropZoneRef.current) {
      setIsDragging(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    handleDragEvent(e);
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
      setUploadResults([]);
    }
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setUploadResults([]);

    const results = [];

    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5001/api/files/upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        results.push({
          filename: file.name,
          success: response.ok,
          message: response.ok
            ? result.message
            : result.error || "Upload failed",
        });
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        results.push({
          filename: file.name,
          success: false,
          message: "Network error occurred",
        });
      }
    }

    setUploadResults(results);
    setUploading(false);

    if (onUploadSuccess) {
      onUploadSuccess();
    }
  };

  // Remove a file from the list
  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="upload-container">
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        multiple
        accept=".pdf,.txt,.docx,.md"
      />

      {/* Drop zone */}
      <div
        ref={dropZoneRef}
        className={`drop-zone ${isDragging ? "active" : ""}`}
        onClick={() => fileInputRef.current.click()}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEvent}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? "#3b82f6" : "#ccc"}`,
          borderRadius: "8px",
          padding: "40px 20px",
          textAlign: "center",
          backgroundColor: isDragging ? "rgba(59, 130, 246, 0.1)" : "#f9fafb",
          cursor: "pointer",
          transition: "all 0.2s ease",
          marginBottom: "16px",
        }}
      >
        <div>
          <p style={{ fontSize: "16px", marginBottom: "8px" }}>
            {isDragging
              ? "Drop files here"
              : "Drag & drop files here or click to browse"}
          </p>
          <p style={{ fontSize: "12px", color: "#6b7280" }}>
            Supported formats: PDF, TXT, DOCX, MD
          </p>
        </div>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div
          style={{
            marginBottom: "16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            padding: "12px",
            border: "1px solid #e5e7eb",
          }}
        >
          <p
            style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}
          >
            {files.length} file(s) selected
          </p>
          <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
            {files.map((file, index) => (
              <li
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  backgroundColor: "white",
                  marginBottom: "4px",
                  borderRadius: "4px",
                  border: "1px solid #e5e7eb",
                }}
              >
                <span style={{ fontWeight: "500", fontSize: "14px" }}>
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </span>
                <button
                  onClick={() => removeFile(index)}
                  disabled={uploading}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={files.length === 0 || uploading}
        style={{
          width: "100%",
          padding: "12px",
          backgroundColor:
            files.length === 0 || uploading ? "#d1d5db" : "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontWeight: "500",
          cursor: files.length === 0 || uploading ? "not-allowed" : "pointer",
          transition: "background-color 0.2s",
        }}
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>

      {/* Results */}
      {uploadResults.length > 0 && (
        <div
          style={{
            marginTop: "16px",
            backgroundColor: "#f3f4f6",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <h4
            style={{ fontSize: "14px", fontWeight: "500", marginBottom: "8px" }}
          >
            Upload Results:
          </h4>
          <ul style={{ maxHeight: "150px", overflowY: "auto" }}>
            {uploadResults.map((result, index) => (
              <li
                key={index}
                style={{
                  padding: "8px 12px",
                  marginBottom: "4px",
                  borderRadius: "4px",
                  backgroundColor: result.success
                    ? "rgba(16, 185, 129, 0.1)"
                    : "rgba(239, 68, 68, 0.1)",
                  color: result.success ? "#10b981" : "#ef4444",
                  borderLeft: `3px solid ${
                    result.success ? "#10b981" : "#ef4444"
                  }`,
                  fontSize: "14px",
                }}
              >
                <strong>{result.filename}:</strong> {result.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
