"use client";

import { useEffect, useState } from "react";
import { Inbox, AlertTriangle, Clock, CheckCircle, Search, Filter, RefreshCw } from "lucide-react";

export default function CRMPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filter, setFilter] = useState({ urgency: "All", status: "All" });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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
      const matchesFilter = (
        (filter.urgency === "All" || ticket.urgency === filter.urgency) &&
        (filter.status === "All" || ticket.status === filter.status)
      );
      
      const matchesSearch = searchQuery === "" || 
        (ticket.message && ticket.message.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ticket.user_id && ticket.user_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ticket.user_name && ticket.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ticket.user_email && ticket.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (ticket.order_id && ticket.order_id.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency?.toLowerCase()) {
      case "high":
        return "bg-red-600";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 border border-blue-200 flex items-center">
            <Inbox className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
      case "in progress":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 border border-purple-200 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
      case "resolved":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 border border-green-200 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status}
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#22337c] text-white">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold">WTS Travel - Ticket Management</h1>
          <p className="text-[#3eafdb]">Customer Support Dashboard</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-[#22337c]">Support Tickets</h2>
              <button 
                onClick={fetchTickets}
                className="ml-4 p-2 text-[#3eafdb] hover:bg-gray-100 rounded-full"
                title="Refresh"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <select
                  className="border rounded-md px-3 py-2 text-sm bg-white"
                  value={filter.urgency}
                  onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
                >
                  <option value="All">All Urgency</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  className="border rounded-md px-3 py-2 text-sm bg-white"
                  value={filter.status}
                  onChange={(e) => setFilter({ ...filter, status: e.target.value })}
                >
                  <option value="All">All Status</option>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce"></div>
                    <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce delay-75"></div>
                    <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              ) : filterTickets(tickets).length === 0 ? (
                <div className="text-center py-10 border rounded-lg bg-gray-50">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="mt-4 text-gray-500">No tickets found matching your criteria</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {filterTickets(tickets).map((ticket) => (
                    <div
                      key={ticket.ticket_id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedTicket?.ticket_id === ticket.ticket_id ? "border-[#3eafdb] bg-[#3eafdb]/5" : ""
                      }`}
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 mr-4">
                          <h3 className="font-medium text-[#22337c] line-clamp-1">{ticket.message}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                            <div className="flex items-center">
                              <span className="text-xs text-gray-500">{formatDate(ticket.created_at)}</span>
                            </div>
                            {ticket.user_name && (
                              <div className="flex items-center">
                                <span className="text-xs font-medium">{ticket.user_name}</span>
                              </div>
                            )}
                            {ticket.order_id && (
                              <div className="flex items-center">
                                <span className="text-xs">Order: {ticket.order_id}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full text-white ${getUrgencyColor(ticket.urgency)}`}>
                            {ticket.urgency}
                          </span>
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="md:col-span-1">
              {selectedTicket ? (
                <div className="border rounded-lg bg-white p-6 sticky top-4">
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-lg font-semibold text-[#22337c]">Ticket Details</h2>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Customer Message</h3>
                      <p className="mt-1 text-sm">{selectedTicket.message}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Ticket ID</h3>
                        <p className="mt-1 text-sm font-mono">{selectedTicket.ticket_id}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Created</h3>
                        <p className="mt-1 text-sm">{formatDate(selectedTicket.created_at)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Type</h3>
                        <p className="mt-1 text-sm">{selectedTicket.intent || "Not specified"}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Urgency</h3>
                        <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getUrgencyColor(selectedTicket.urgency)}`}>
                          {selectedTicket.urgency}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Customer Details</h3>
                      <div className="mt-1 space-y-1 text-sm border-l-2 border-[#3eafdb] pl-3 py-1">
                        <p><strong>Name:</strong> {selectedTicket.user_name || "Not provided"}</p>
                        <p><strong>Email:</strong> {selectedTicket.user_email || "Not provided"}</p>
                        <p><strong>Order ID:</strong> {selectedTicket.order_id || "Not provided"}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Status</h3>
                      <div className="mt-2">
                        <select
                          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3eafdb]"
                          value={selectedTicket.status}
                          onChange={(e) => handleStatusUpdate(selectedTicket.ticket_id, e.target.value)}
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t text-right">
                      <button 
                        className="px-4 py-2 bg-[#22337c] text-white rounded-md hover:bg-[#22337c]/90 transition-colors"
                        onClick={() => setSelectedTicket(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg bg-white p-6 h-64 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <Inbox className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-[#22337c] mb-1">No Ticket Selected</h3>
                  <p className="text-gray-500 text-sm">Select a ticket from the list to view its details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}