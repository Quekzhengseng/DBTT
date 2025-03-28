"use client";

import Link from "next/link";
import "./staffNavbar.css"; // Import the CSS file

export default function StaffLayout({ children }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <img
              src="/wts-logo.png"
              alt="WTS Travel Logo"
              className="navbar-logo"
            />
            <div>
              <h1 className="navbar-title">WTS Travel Staff Portal</h1>
              <p className="navbar-subtitle">Staff Access</p>
            </div>
          </div>

          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="/staff" className="nav-link active">
                Tickets
              </a>
            </li>
            <li className="nav-item">
              <a href="/staff/upload" className="nav-link">
                Upload Files
              </a>
            </li>
            <li className="nav-item">
              <a href="/chat" className="nav-link">
                Chat Interface
              </a>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Staff Account
              </a>
            </li>
          </ul>

          <div className="user-profile">
            <div className="avatar">SA</div>
            <span className="user-name">Staff Admin</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>{children}</main>
    </div>
  );
}
