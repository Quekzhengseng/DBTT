"use client";

import { useEffect, useState } from "react";

export default function CRMPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState({ urgency: "All", status: "All" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5001/api/issues/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data);
      }
    } catch (error) {
      console.error("Failed to fetch tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
  };

  const handleStatusUpdate = async (ticketId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/issues/ticket/${ticketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        setTickets((prev) =>
          prev.map((ticket) =>
            ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
          )
        );

        if (selectedTicket && selectedTicket.ticket_id === ticketId) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const filterTickets = (tickets) => {
    return tickets.filter((ticket) => {
      return (
        (filter.urgency === "All" || ticket.urgency === filter.urgency) &&
        (filter.status === "All" || ticket.status === filter.status)
      );
    });
  };

  return (
    <div className="crm-container">
      <h1 className="crm-title">Ticket Management</h1>

      {/* Filters */}
      <div className="filter-container">
        <select
          className="filter-dropdown"
          value={filter.urgency}
          onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
        >
          <option value="All">All Urgency</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          className="filter-dropdown"
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Ticket List */}
      <div className="ticket-list">
        {loading ? (
          <p>Loading tickets...</p>
        ) : filterTickets(tickets).length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          filterTickets(tickets).map((ticket) => (
            <div
              key={ticket.ticket_id}
              className="ticket-card"
              onClick={() => handleTicketClick(ticket)}
            >
              <h3 className="ticket-title">{ticket.message}</h3>
              <p className="ticket-meta">
                <span className={`urgency-badge ${ticket.urgency.toLowerCase()}`}>
                  {ticket.urgency}
                </span>
                <span className="ticket-status">{ticket.status}</span>
              </p>
            </div>
          ))
        )}
      </div>

      {/* Ticket Details Panel */}
      {selectedTicket && (
        <div className="ticket-details">
          <h2>Ticket Details</h2>
          <p><strong>Message:</strong> {selectedTicket.message}</p>
          <p><strong>User:</strong> {selectedTicket.user_id}</p>
          <p><strong>Urgency:</strong> {selectedTicket.urgency}</p>
          <p><strong>Status:</strong> {selectedTicket.status}</p>

          <select
            className="status-dropdown"
            value={selectedTicket.status}
            onChange={(e) =>
              handleStatusUpdate(selectedTicket.ticket_id, e.target.value)
            }
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>

          <button className="close-btn" onClick={() => setSelectedTicket(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
}
