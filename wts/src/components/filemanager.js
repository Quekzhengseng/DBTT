"use client";

import { useEffect, useState } from "react";
import { FileText, Trash2, RefreshCw } from "lucide-react";
import "./filemanager.css";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5001/api/files/sources");
      if (!response.ok) {
        throw new Error(`Error fetching files: ${response.statusText}`);
      }
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      console.error("Failed to fetch files:", err);
      setError(err.message || "Failed to fetch uploaded files");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileName) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${fileName}"? This action cannot be undone.`
      )
    ) {
      setDeleteInProgress(true);
      try {
        const response = await fetch(
          `http://localhost:5001/api/files/delete/${encodeURIComponent(
            fileName
          )}`,
          {
            method: "DELETE",
          }
        );

        if (!response.ok) {
          throw new Error(`Error deleting file: ${response.statusText}`);
        }

        // Refresh the files list
        fetchFiles();
      } catch (err) {
        console.error("Failed to delete file:", err);
        setError(err.message || "Failed to delete file");
      } finally {
        setDeleteInProgress(false);
      }
    }
  };

  return (
    <div className="fileManagerContainer">
      <div className="fileManagerHeader">
        <h3 className="fileManagerTitle">Uploaded Files</h3>
        <button
          className="refreshButton"
          onClick={fetchFiles}
          disabled={loading}
        >
          <RefreshCw
            size={16}
            className={
              loading ? "refreshButtonIconSpinning" : "refreshButtonIcon"
            }
          />
          Refresh
        </button>
      </div>

      {error && <div className="errorMessage">{error}</div>}

      {loading ? (
        <div className="loadingContainer">
          <div className="loadingSpinner"></div>
          <p>Loading files...</p>
        </div>
      ) : files.length === 0 ? (
        <div className="emptyState">
          <FileText size={32} className="emptyStateIcon" />
          <p>No files have been uploaded yet.</p>
        </div>
      ) : (
        <div className="filesList">
          {files.map((file, index) => (
            <div key={index} className="fileItem">
              <div className="fileItemContent">
                <div className="fileIcon">
                  <FileText size={20} />
                </div>
                <div className="fileDetails">
                  <h4 className="fileName">{file.name}</h4>
                  <p className="fileInfo">
                    <span className="fileChunks">{file.chunks} chunks</span>
                  </p>
                </div>
              </div>
              <button
                className="deleteButton"
                onClick={() => handleDelete(file.name)}
                disabled={deleteInProgress}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
