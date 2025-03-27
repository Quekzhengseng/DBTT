"use client";

import { useState } from "react";
import FileUpload from "../../../components/FileUpload"; // Adjust the import path as needed
import FileManager from "../../../components/FileManager"; // Import the new component
import "./uploadPage.css";

export default function UploadPage() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [fileManagerKey, setFileManagerKey] = useState(0); // For forcing re-render of FileManager

  const handleUploadSuccess = () => {
    setUploadSuccess(true);

    // Refresh FileManager component
    setFileManagerKey((prevKey) => prevKey + 1);

    // Reset the success message after 3 seconds
    setTimeout(() => {
      setUploadSuccess(false);
    }, 3000);
  };

  return (
    <div className="container">
      <div className="pageCard">
        <div className="pageHeader">
          <h2 className="pageTitle">Upload Resources</h2>
          <p className="pageDescription">
            Upload documents and files to the system for agent reference and
            customer support
          </p>
        </div>

        {uploadSuccess && (
          <div className="successAlert">
            Files uploaded successfully! They are now available in the knowledge
            base.
          </div>
        )}

        <div className="contentGrid">
          <div>
            <div className="uploadSection">
              <h3 className="sectionTitle">File Upload</h3>
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>

            <div className="supportedFilesSection">
              <h3 className="sectionTitle">Supported File Types</h3>
              <div className="fileTypesGrid">
                <div className="fileTypeItem">
                  <div className="fileTypeIcon fileTypePdf">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.5 16a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-3zm6 0a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-3z" />
                    </svg>
                  </div>
                  <div className="fileTypeInfo">
                    <h4>PDF Documents</h4>
                    <p>Standard PDF format</p>
                  </div>
                </div>

                <div className="fileTypeItem">
                  <div className="fileTypeIcon fileTypeTxt">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M13.5 3h-11a.5.5 0 0 0-.5.5v13a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5v-13a.5.5 0 0 0-.5-.5z" />
                    </svg>
                  </div>
                  <div className="fileTypeInfo">
                    <h4>Text Files</h4>
                    <p>Plain text (.txt) format</p>
                  </div>
                </div>

                <div className="fileTypeItem">
                  <div className="fileTypeIcon fileTypeDocx">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M14 2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm-3 14H9v-1h2v1zm0-3H9v-1h2v1zm0-3H9V9h2v1zm3 6h-2v-1h2v1zm0-3h-2v-1h2v1zm0-3h-2V9h2v1zm0-3H7V5h7v2z" />
                    </svg>
                  </div>
                  <div className="fileTypeInfo">
                    <h4>Word Documents</h4>
                    <p>Microsoft Word (.docx)</p>
                  </div>
                </div>

                <div className="fileTypeItem">
                  <div className="fileTypeIcon fileTypeMd">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M14.5 3h-13a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13z" />
                      <path d="M3 5.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 8zm0 2.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5z" />
                    </svg>
                  </div>
                  <div className="fileTypeInfo">
                    <h4>Markdown</h4>
                    <p>Markdown files (.md)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="guidelinesSection">
            <h3 className="sectionTitle">Upload Guidelines</h3>

            <div className="guidelinesList">
              <div className="guidelineItem">
                <h4>File Size</h4>
                <p>Maximum file size: 10MB per file</p>
              </div>

              <div className="guidelineItem">
                <h4>Content Type</h4>
                <p>
                  Upload travel guides, policy documents, FAQs, or training
                  materials
                </p>
              </div>

              <div className="guidelineItem">
                <h4>Naming Convention</h4>
                <p>Use descriptive names without special characters</p>
              </div>

              <div className="guidelineItem">
                <h4>Processing</h4>
                <p>
                  Files will be processed and indexed for customer support
                  knowledge base
                </p>
              </div>
            </div>

            <div className="infoBox">
              <div className="infoContent">
                <div className="infoIcon">
                  <svg
                    width="20"
                    height="20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="infoText">
                  After uploading, files will be automatically processed and
                  added to the knowledge base for improved customer support
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* File Manager Section */}
        <FileManager key={fileManagerKey} />
      </div>
    </div>
  );
}
