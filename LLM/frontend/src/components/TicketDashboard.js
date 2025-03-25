"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from 'next/image';

export default function TicketDashboard() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [activeTab, setActiveTab] = useState("pending"); // "pending" or "previous"
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  
  // Initialize with real data by default
  useEffect(() => {
    fetchTicketsFromBackend();
  }, []);

  const fetchTicketsFromBackend = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the real tickets endpoint
      console.log("Fetching tickets from backend...");
      const response = await fetch("http://localhost:5001/api/issues/tickets");
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Tickets retrieved:", data);
      
      if (Array.isArray(data) && data.length > 0) {
        setTickets(data);
      } else {
        console.log("No tickets found or empty array returned");
        setTickets([]);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
      setError(`Failed to load tickets: ${error.message}`);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5001/api/issues/ticket/${ticketId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        console.log(`Successfully updated status of ticket ${ticketId} to ${newStatus}`);
        setTickets((prev) =>
          prev.map((ticket) => (ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket))
        );

        if (selectedTicket && selectedTicket.ticket_id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      } else {
        console.error(`Failed to update ticket status. HTTP status: ${response.status}`);
        alert("Failed to update ticket status. Please try again.");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      alert(`Error updating ticket: ${error.message}`);
    }
  };

  // Filter tickets based on active tab
  const pendingTickets = tickets.filter((ticket) => 
    ticket.status === "Open" || ticket.status === "In Progress"
  );
  
  const resolvedTickets = tickets.filter((ticket) => 
    ticket.status === "Resolved"
  );

  const displayTickets = activeTab === "pending" ? pendingTickets : resolvedTickets;
  
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };
  
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const refreshTickets = () => {
    fetchTicketsFromBackend();
  };


  const generateTicketHeader = (ticket) => {
    const { message, intent, order_id, user_name } = ticket;
    
    // Extract service type or issue category
    let serviceType = "";
    let issueType = "";
    
    // Service type detection
    if (message.toLowerCase().includes("jb") || message.toLowerCase().includes("johor") || message.toLowerCase().includes("coach")) {
      serviceType = "JB Coach";
    } else if (message.toLowerCase().includes("flight") || message.toLowerCase().includes("plane") || message.toLowerCase().includes("air")) {
      serviceType = "Flight";
    } else if (message.toLowerCase().includes("hotel") || message.toLowerCase().includes("accommodation") || message.toLowerCase().includes("room")) {
      serviceType = "Hotel";
    } else if (message.toLowerCase().includes("tour") || message.toLowerCase().includes("package")) {
      serviceType = "Tour Package";
    } else if (message.toLowerCase().includes("train") || message.toLowerCase().includes("rail")) {
      serviceType = "Train";
    } else if (message.toLowerCase().includes("bus") || message.toLowerCase().includes("coach")) {
      serviceType = "Bus Service";
    } else if (message.toLowerCase().includes("taxi") || message.toLowerCase().includes("car") || message.toLowerCase().includes("transport")) {
      serviceType = "Transport";
    }
    
    // Issue type detection (if not already in the intent)
    if (message.toLowerCase().includes("book") || message.toLowerCase().includes("reservation")) {
      issueType = "Booking";
    } else if (message.toLowerCase().includes("refund") || message.toLowerCase().includes("money back")) {
      issueType = "Refund";
    } else if (message.toLowerCase().includes("cancel")) {
      issueType = "Cancellation";
    } else if (message.toLowerCase().includes("luggage") || message.toLowerCase().includes("baggage") || message.toLowerCase().includes("bag")) {
      issueType = "Luggage";
    } else if (message.toLowerCase().includes("delay") || message.toLowerCase().includes("late")) {
      issueType = "Delay";
    } else if (message.toLowerCase().includes("change date") || message.toLowerCase().includes("reschedule")) {
      issueType = "Rescheduling";
    } else if (message.toLowerCase().includes("lost") || message.toLowerCase().includes("found")) {
      issueType = "Lost & Found";
    }
    
    // Construct header
    let header = "";
    
    // Use intent as a fallback if we couldn't determine issue type
    if (!issueType && intent) {
      issueType = intent;
    }
    
    // Combine service type and issue type
    if (serviceType && issueType) {
      header = `${serviceType} ${issueType}`;
    } else if (serviceType) {
      header = `${serviceType} Issue`;
    } else if (issueType) {
      header = `${issueType} Issue`;
    } else {
      // Fallback to intent or generic header
      header = intent || "Customer Request";
    }
    
    // Add order ID if present
    if (order_id && order_id !== "" && order_id !== "null") {
      return `${header} - Order #${order_id}`;
    }
    
    return header;
  };

  return (
    <div className="min-h-screen bg-white">
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          {/* Add WTS Logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <Image 
              src="/wts-logo.png" 
              alt="WTS Travel" 
              width={180} 
              height={40} 
              priority
            />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#22337c", marginBottom: "1rem" }}>TICKETING DASHBOARD</h1>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", color: "#3eafdb", textDecoration: "none", marginBottom: "1.5rem" }}>
            <ArrowLeft style={{ width: "1rem", height: "1rem", marginRight: "0.25rem" }} /> 
            Back to Chat Interface
          </Link>
          
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem", gap: "1rem" }}>
            <button 
              onClick={refreshTickets}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#3eafdb",
                color: "white",
                border: "none",
                borderRadius: "0.375rem",
                fontWeight: "500",
                cursor: "pointer"
              }}
            >
              <RefreshCw style={{ width: "1rem", height: "1rem" }} />
              Refresh Tickets
            </button>
          </div>
          
          {/* Status Info */}
          <div style={{ 
            backgroundColor: "#f3f4f6", 
            padding: "0.5rem", 
            borderRadius: "0.25rem", 
            fontSize: "0.75rem",
            color: "#6b7280",
            marginBottom: "1rem" 
          }}>
            Connected to backend API
          </div>

          {/* Show error message if there's an error */}
          {error && (
            <div style={{ 
              backgroundColor: "#fee2e2", 
              padding: "0.75rem", 
              borderRadius: "0.25rem", 
              fontSize: "0.875rem",
              color: "#b91c1c",
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem" 
            }}>
              <AlertCircle style={{ width: "1rem", height: "1rem" }} />
              {error}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div 
            onClick={() => setActiveTab("previous")}
            style={{ 
              padding: "1rem 2rem", 
              borderRadius: "0.5rem", 
              fontWeight: "600", 
              textAlign: "center", 
              cursor: "pointer", 
              minWidth: "200px", 
              backgroundColor: activeTab === "previous" ? "#22337c" : "#f3f4f6",
              color: activeTab === "previous" ? "white" : "#1f2937"
            }}
          >
            Previous Tickets
          </div>
          <div 
            onClick={() => setActiveTab("pending")}
            style={{ 
              padding: "1rem 2rem", 
              borderRadius: "0.5rem", 
              fontWeight: "600", 
              textAlign: "center", 
              cursor: "pointer", 
              minWidth: "200px", 
              backgroundColor: activeTab === "pending" ? "#3eafdb" : "#f3f4f6",
              color: activeTab === "pending" ? "white" : "#1f2937"
            }}
          >
            Pending Tickets
          </div>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <div style={{ 
                width: "0.75rem", 
                height: "0.75rem", 
                backgroundColor: "#3eafdb", 
                borderRadius: "9999px",
                animation: "bounce 1s infinite" 
              }}></div>
              <div style={{ 
                width: "0.75rem", 
                height: "0.75rem", 
                backgroundColor: "#3eafdb", 
                borderRadius: "9999px",
                animation: "bounce 1s infinite",
                animationDelay: "0.2s"
              }}></div>
              <div style={{ 
                width: "0.75rem", 
                height: "0.75rem", 
                backgroundColor: "#3eafdb", 
                borderRadius: "9999px",
                animation: "bounce 1s infinite",
                animationDelay: "0.4s"
              }}></div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ 
              backgroundColor: "#ecf9fd", 
              borderRadius: "0.75rem", 
              padding: "1.5rem", 
              marginBottom: "1.5rem" 
            }}>
              <h2 style={{ 
                fontSize: "1.25rem", 
                fontWeight: "600", 
                marginBottom: "1rem" 
              }}>
                {activeTab === "pending" ? "Your Current Tickets" : "Your Resolved Tickets"}
              </h2>
              
              {displayTickets.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "2rem", 
                  color: "#6b7280" 
                }}>
                  No {activeTab === "pending" ? "pending" : "resolved"} tickets found
                </div>
              ) : (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                  gap: "1rem" 
                }}>
                  {displayTickets.map((ticket) => (
                    <div
                      key={ticket.ticket_id}
                      onClick={() => handleTicketClick(ticket)}
                      style={{ 
                        backgroundColor: "#f0c513", 
                        color: "#1f2937", 
                        padding: "1rem", 
                        borderRadius: "1rem", 
                        cursor: "pointer" 
                      }}
                    >
                      <h3 style={{ fontWeight: "500", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {generateTicketHeader(ticket)}
                      </h3>
                      <div style={{ marginTop: "0.5rem", fontSize: "0.875rem" }}>
                        Ticket ID: {ticket.ticket_id.substring(0, 10)}...
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTicket && (
              <div style={{ 
                backgroundColor: "white", 
                padding: "1.5rem", 
                borderRadius: "0.5rem", 
                border: "1px solid #e5e7eb", 
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
              }}>
                <div style={{ borderBottom: "1px solid #e5e7eb", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "700", color: "#22337c" }}>Ticket Details</h2>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Customer Message</h3>
                    <p style={{ marginTop: "0.25rem" }}>{selectedTicket.message}</p>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Ticket ID</h3>
                      <p style={{ marginTop: "0.25rem", fontFamily: "monospace" }}>{selectedTicket.ticket_id}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Created</h3>
                      <p style={{ marginTop: "0.25rem" }}>
                        {selectedTicket.created_at ? formatDate(selectedTicket.created_at) : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Type</h3>
                      <p style={{ marginTop: "0.25rem" }}>{selectedTicket.intent || "Not specified"}</p>
                    </div>
                    <div>
                      <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Urgency</h3>
                      <div style={{ 
                        marginTop: "0.25rem", 
                        display: "inline-block", 
                        padding: "0.25rem 0.5rem", 
                        borderRadius: "9999px", 
                        fontSize: "0.75rem", 
                        fontWeight: "500", 
                        color: "white", 
                        backgroundColor: selectedTicket.urgency === "High" ? "#ef4444" : 
                                          selectedTicket.urgency === "Medium" ? "#f59e0b" : "#10b981" 
                      }}>
                        {selectedTicket.urgency}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Customer Details</h3>
                    <div style={{ 
                      marginTop: "0.25rem", 
                      borderLeft: "2px solid #3eafdb", 
                      paddingLeft: "0.75rem", 
                      paddingTop: "0.25rem", 
                      paddingBottom: "0.25rem" 
                    }}>
                      <p><strong>Name:</strong> {selectedTicket.user_name || "Not provided"}</p>
                      <p><strong>Email:</strong> {selectedTicket.user_email || "Not provided"}</p>
                      <p><strong>Order ID:</strong> {selectedTicket.order_id || "Not provided"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ fontSize: "0.875rem", fontWeight: "500", color: "#6b7280" }}>Status</h3>
                    <div style={{ marginTop: "0.5rem" }}>
                      <select
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: "1px solid #e5e7eb",
                          borderRadius: "0.375rem",
                          outline: "none"
                        }}
                        value={selectedTicket.status}
                        onChange={(e) => handleStatusUpdate(selectedTicket.ticket_id, e.target.value)}
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ 
                    paddingTop: "1rem", 
                    marginTop: "1rem", 
                    borderTop: "1px solid #e5e7eb", 
                    textAlign: "right" 
                  }}>
                    <button 
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#22337c",
                        color: "white",
                        borderRadius: "0.375rem",
                        border: "none",
                        cursor: "pointer"
                      }}
                      onClick={() => setSelectedTicket(null)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}