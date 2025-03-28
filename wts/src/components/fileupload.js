"use client";

import { useState, useRef } from "react";
import { Upload, X, FileText } from "lucide-react";
import styles from "./fileupload.module.css";

export default function FileUpload({ onUploadSuccess }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState([]);
  const fileInputRef = useRef(null);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
      setUploadResults([]);
    }
  };

  // Handle upload button click
  const handleUpload = async () => {
    if (!files.length) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadResults([]);

    const results = [];
    const totalFiles = files.length;
    let completedFiles = 0;

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

        // Update progress
        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      } catch (error) {
        console.error(`Error uploading file ${file.name}:`, error);
        results.push({
          filename: file.name,
          success: false,
          message: "Network error occurred",
        });

        // Update progress even for failed uploads
        completedFiles++;
        setUploadProgress(Math.round((completedFiles / totalFiles) * 100));
      }
    }

    setUploadResults(results);
    setUploading(false);

    // Call the success callback if at least one file was uploaded successfully
    if (results.some((result) => result.success) && onUploadSuccess) {
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
    <div className="w-full">
      <div>
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
          multiple
          accept=".pdf,.txt,.docx,.md"
        />

        {/* Browse button */}
        <button
          onClick={() => fileInputRef.current.click()}
          className="sidebar-button"
        >
          <Upload className="w-4 h-4" />
          Browse files
        </button>

        {/* File list */}
        {files.length > 0 && (
          <div className="mt-4">
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-[#ecf9fd] p-2 rounded"
                >
                  <div className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-[#22337c]" />
                    <span className="truncate max-w-[200px] text-sm">
                      {file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-gray-500 hover:text-red-500 p-1 rounded-full"
                    disabled={uploading}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload progress */}
        {uploading && (
          <div className="mt-4">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3eafdb] transition-all"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-xs text-center mt-1 text-gray-500">
              Uploading: {uploadProgress}%
            </div>
          </div>
        )}

        {/* Upload button */}
        {files.length > 0 && !uploading && (
          <button
            className="mt-4 bg-[#22337c] text-white py-2 px-4 rounded-full w-full font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
          >
            Upload {files.length} file{files.length !== 1 ? "s" : ""}
          </button>
        )}

        {/* Results */}
        {uploadResults.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Upload Results:</h3>
            <div className="space-y-2">
              {uploadResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm flex items-start ${
                    result.success
                      ? "bg-green-50 text-green-800"
                      : "bg-red-50 text-red-800"
                  }`}
                >
                  <span className="truncate">
                    {result.filename}: {result.message}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
