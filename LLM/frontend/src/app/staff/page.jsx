"use client"

import TicketDashboard from "@/components/TicketDashboard"

export default function StaffPage() {
  return <TicketDashboard />
}



// "use client"

// import { useState, useEffect } from "react"

// export default function StaffDashboard() {
//   const [tickets, setTickets] = useState([])
//   const [selectedTicket, setSelectedTicket] = useState(null)
//   const [filter, setFilter] = useState({ urgency: "all", status: "all", type: "all" })
//   const [searchQuery, setSearchQuery] = useState("")
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     fetchTickets()
//   }, [])

//   const fetchTickets = async () => {
//     try {
//       setLoading(true)
//       const response = await fetch("http://localhost:5001/api/issues/tickets")
//       if (response.ok) {
//         const data = await response.json()
//         setTickets(data)
//       }
//     } catch (error) {
//       console.error("Failed to fetch tickets:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleTicketClick = (ticket) => {
//     setSelectedTicket(ticket)
//   }

//   const handleStatusUpdate = async (ticketId, newStatus) => {
//     try {
//       const response = await fetch(`http://localhost:5001/api/issues/ticket/${ticketId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       })

//       if (response.ok) {
//         // Update local state
//         setTickets((prev) =>
//           prev.map((ticket) => (ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket)),
//         )

//         if (selectedTicket && selectedTicket.ticket_id === ticketId) {
//           setSelectedTicket({ ...selectedTicket, status: newStatus })
//         }
//       }
//     } catch (error) {
//       console.error("Failed to update status:", error)
//     }
//   }

//   const formatDate = (timestamp) => {
//     if (!timestamp) return "N/A"
//     const date = new Date(timestamp)
//     return date.toLocaleString()
//   }

//   const getUrgencyColor = (urgency) => {
//     switch (urgency?.toLowerCase()) {
//       case "high":
//         return "bg-red-100 text-red-800 border-red-200"
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 border-yellow-200"
//       case "low":
//         return "bg-green-100 text-green-800 border-green-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "open":
//         return "bg-blue-100 text-blue-800 border-blue-200"
//       case "in progress":
//         return "bg-purple-100 text-purple-800 border-purple-200"
//       case "resolved":
//         return "bg-green-100 text-green-800 border-green-200"
//       default:
//         return "bg-gray-100 text-gray-800 border-gray-200"
//     }
//   }

//   const getTypeIcon = (type) => {
//     switch (type?.toLowerCase()) {
//       case "complaint":
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
//             />
//           </svg>
//         )
//       case "booking issue":
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
//             />
//           </svg>
//         )
//       case "lost & found":
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         )
//       default:
//         return (
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-4 w-4 mr-1"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//             />
//           </svg>
//         )
//     }
//   }

//   const filteredTickets = tickets.filter((ticket) => {
//     // Apply search filter
//     const matchesSearch =
//       searchQuery === "" ||
//       ticket.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ticket.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ticket.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       ticket.order_id?.toLowerCase().includes(searchQuery.toLowerCase())

//     // Apply dropdown filters
//     const matchesUrgency = filter.urgency === "all" || ticket.urgency?.toLowerCase() === filter.urgency
//     const matchesStatus = filter.status === "all" || ticket.status?.toLowerCase() === filter.status
//     const matchesType = filter.type === "all" || ticket.intent?.toLowerCase() === filter.type

//     return matchesSearch && matchesUrgency && matchesStatus && matchesType
//   })

//   return (
//     <div className="container mx-auto py-6 max-w-7xl">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-[#22337c]">WTS Travel Support Dashboard</h1>
//         <button onClick={fetchTickets} className="bg-[#3eafdb] text-white px-4 py-2 rounded-md hover:bg-[#3eafdb]/90">
//           Refresh Tickets
//         </button>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div className="md:col-span-2">
//           <div className="bg-white p-4 rounded-lg border shadow-sm">
//             <div className="pb-3 border-b mb-4">
//               <div className="flex justify-between items-center">
//                 <h2 className="text-xl font-bold text-[#22337c]">Customer Support Tickets</h2>
//                 <div className="flex items-center space-x-2">
//                   <div className="relative">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                       />
//                     </svg>
//                     <input
//                       type="search"
//                       placeholder="Search tickets..."
//                       className="pl-8 w-[200px] md:w-[300px] border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-[#3eafdb]"
//                       value={searchQuery}
//                       onChange={(e) => setSearchQuery(e.target.value)}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="flex flex-wrap gap-2 mt-2">
//                 <select
//                   className="px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#3eafdb]"
//                   value={filter.urgency}
//                   onChange={(e) => setFilter({ ...filter, urgency: e.target.value })}
//                 >
//                   <option value="all">All Urgency</option>
//                   <option value="high">High</option>
//                   <option value="medium">Medium</option>
//                   <option value="low">Low</option>
//                 </select>
//                 <select
//                   className="px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#3eafdb]"
//                   value={filter.status}
//                   onChange={(e) => setFilter({ ...filter, status: e.target.value })}
//                 >
//                   <option value="all">All Status</option>
//                   <option value="open">Open</option>
//                   <option value="in progress">In Progress</option>
//                   <option value="resolved">Resolved</option>
//                 </select>
//                 <select
//                   className="px-3 py-1 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-[#3eafdb]"
//                   value={filter.type}
//                   onChange={(e) => setFilter({ ...filter, type: e.target.value })}
//                 >
//                   <option value="all">All Types</option>
//                   <option value="complaint">Complaints</option>
//                   <option value="booking issue">Booking Issues</option>
//                   <option value="lost & found">Lost & Found</option>
//                   <option value="general inquiry">General Inquiries</option>
//                 </select>
//               </div>
//             </div>
//             <div>
//               {loading ? (
//                 <div className="flex justify-center items-center h-64">
//                   <div className="flex space-x-2">
//                     <div className="w-3 h-3 bg-[#3eafdb]rounded-full animate-bounce"></div>
//                     <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce delay-75"></div>
//                     <div className="w-3 h-3 bg-[#3eafdb] rounded-full animate-bounce delay-150"></div>
//                   </div>
//                 </div>
//               ) : filteredTickets.length === 0 ? (
//                 <div className="text-center py-10 text-gray-500">No tickets found matching your criteria</div>
//               ) : (
//                 <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
//                   {filteredTickets.map((ticket) => (
//                     <div
//                       key={ticket.ticket_id}
//                       className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
//                         selectedTicket?.ticket_id === ticket.ticket_id ? "border-[#22337c] bg-[#22337c]/5" : ""
//                       }`}
//                       onClick={() => handleTicketClick(ticket)}
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <h3 className="font-medium line-clamp-1">{ticket.message}</h3>
//                           <div className="flex items-center text-sm text-gray-500 mt-1">
//                             <svg
//                               xmlns="http://www.w3.org/2000/svg"
//                               className="h-3 w-3 mr-1"
//                               fill="none"
//                               viewBox="0 0 24 24"
//                               stroke="currentColor"
//                             >
//                               <path
//                                 strokeLinecap="round"
//                                 strokeLinejoin="round"
//                                 strokeWidth={2}
//                                 d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                               />
//                             </svg>
//                             <span>{formatDate(ticket.created_at)}</span>
//                           </div>
//                         </div>
//                         <div className="flex flex-col gap-2 items-end">
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(ticket.urgency)}`}
//                           >
//                             {ticket.urgency}
//                           </span>
//                           <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}
//                           >
//                             {ticket.status}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center mt-2 text-xs">
//                         <span className="border px-2 py-1 rounded-full flex items-center mr-2">
//                           {getTypeIcon(ticket.intent)}
//                           {ticket.intent}
//                         </span>
//                         {ticket.order_id && (
//                           <span className="border px-2 py-1 rounded-full">Order: {ticket.order_id}</span>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         <div className="md:col-span-1">
//           {selectedTicket ? (
//             <div className="bg-white p-4 rounded-lg border shadow-sm">
//               <div className="border-b pb-3 mb-4">
//                 <h2 className="text-xl font-bold text-[#22337c]">Ticket Details</h2>
//               </div>
//               <div className="space-y-4">
//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Customer Message</h3>
//                   <p className="mt-1">{selectedTicket.message}</p>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Ticket ID</h3>
//                     <p className="mt-1 text-sm">{selectedTicket.ticket_id}</p>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Created</h3>
//                     <p className="mt-1 text-sm">{formatDate(selectedTicket.created_at)}</p>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Type</h3>
//                     <span className="mt-1 inline-flex items-center border px-2 py-1 rounded-full text-xs">
//                       {getTypeIcon(selectedTicket.intent)}
//                       {selectedTicket.intent}
//                     </span>
//                   </div>
//                   <div>
//                     <h3 className="text-sm font-medium text-gray-500">Urgency</h3>
//                     <span
//                       className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(selectedTicket.urgency)}`}
//                     >
//                       {selectedTicket.urgency}
//                     </span>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Customer Details</h3>
//                   <div className="mt-1 space-y-1 text-sm">
//                     <p>
//                       <strong>Name:</strong> {selectedTicket.user_name || "Not provided"}
//                     </p>
//                     <p>
//                       <strong>Email:</strong> {selectedTicket.user_email || "Not provided"}
//                     </p>
//                     <p>
//                       <strong>Order ID:</strong> {selectedTicket.order_id || "Not provided"}
//                     </p>
//                   </div>
//                 </div>

//                 <div>
//                   <h3 className="text-sm font-medium text-gray-500">Status</h3>
//                   <div className="mt-2">
//                     <select
//                       className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3eafdb]"
//                       value={selectedTicket.status}
//                       onChange={(e) => handleStatusUpdate(selectedTicket.ticket_id, e.target.value)}
//                     >
//                       <option value="Open">Open</option>
//                       <option value="In Progress">In Progress</option>
//                       <option value="Resolved">Resolved</option>
//                     </select>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white p-6 rounded-lg border shadow-sm">
//               <div className="flex flex-col items-center justify-center h-64">
//                 <svg
//                   xmlns="http://www.w3.org/2000/svg"
//                   className="h-12 w-12 text-gray-400 mb-4"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
//                   />
//                 </svg>
//                 <p className="text-gray-500 text-center">Select a ticket to view details</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }

