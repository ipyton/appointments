"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// Mock invitation data
const mockInvitations = [
  {
    id: "1",
    eventTitle: "Hair Cut",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2023-10-20",
    startTime: "14:00",
    endTime: "15:00",
    message: "I'd like to book an appointment for a regular haircut.",
    status: "pending",
    createdAt: "2023-10-15T10:30:00Z"
  },
  {
    id: "2",
    eventTitle: "Massage Therapy",
    clientName: "Jane Smith",
    clientEmail: "jane@example.com",
    date: "2023-10-22",
    startTime: "10:00",
    endTime: "11:30",
    message: "Looking for a deep tissue massage.",
    status: "pending",
    createdAt: "2023-10-16T09:15:00Z"
  },
  {
    id: "3",
    eventTitle: "Consultation",
    clientName: "Mike Johnson",
    clientEmail: "mike@example.com",
    date: "2023-10-18",
    startTime: "16:00",
    endTime: "16:30",
    message: "I need advice on my fitness routine.",
    status: "accepted",
    createdAt: "2023-10-14T14:45:00Z"
  },
  {
    id: "4",
    eventTitle: "Hair Coloring",
    clientName: "Sarah Williams",
    clientEmail: "sarah@example.com",
    date: "2023-10-25",
    startTime: "11:00",
    endTime: "13:00",
    message: "I'd like to get my hair colored blonde.",
    status: "declined",
    createdAt: "2023-10-12T16:20:00Z"
  }
];

export default function ProviderInvitationsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "declined">("all");
  const [invitations, setInvitations] = useState(mockInvitations);

  // Filter invitations based on status
  const filteredInvitations = filter === "all" 
    ? invitations 
    : invitations.filter(inv => inv.status === filter);

  // Handle accepting an invitation
  const handleAccept = (id: string) => {
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: "accepted" } : inv
    ));
  };

  // Handle declining an invitation
  const handleDecline = (id: string) => {
    setInvitations(invitations.map(inv => 
      inv.id === id ? { ...inv, status: "declined" } : inv
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Appointment Invitations</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200"}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("accepted")}
            className={`px-3 py-1 rounded ${filter === "accepted" ? "bg-green-600 text-white" : "bg-gray-200"}`}
          >
            Accepted
          </button>
          <button 
            onClick={() => setFilter("declined")}
            className={`px-3 py-1 rounded ${filter === "declined" ? "bg-red-600 text-white" : "bg-gray-200"}`}
          >
            Declined
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredInvitations.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No invitations found matching your filter.
          </div>
        ) : (
          <div className="divide-y">
            {filteredInvitations.map((invitation) => (
              <div key={invitation.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-lg">{invitation.eventTitle}</h3>
                    <p className="text-gray-600">
                      {invitation.date} • {invitation.startTime} - {invitation.endTime}
                    </p>
                    <p className="mt-1">
                      <span className="font-medium">Client:</span> {invitation.clientName} ({invitation.clientEmail})
                    </p>
                    {invitation.message && (
                      <p className="mt-2 bg-gray-50 p-2 rounded text-sm">
                        {invitation.message}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Requested on {new Date(invitation.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    {invitation.status === "pending" ? (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleAccept(invitation.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDecline(invitation.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                        >
                          Decline
                        </button>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${invitation.status === "accepted" ? "bg-green-100 text-green-800" : ""}
                        ${invitation.status === "declined" ? "bg-red-100 text-red-800" : ""}
                      `}>
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Total Invitations</h3>
          <p className="text-2xl font-bold">{invitations.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Pending</h3>
          <p className="text-2xl font-bold">{invitations.filter(inv => inv.status === "pending").length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Acceptance Rate</h3>
          <p className="text-2xl font-bold">
            {Math.round(
              (invitations.filter(inv => inv.status === "accepted").length / 
              invitations.filter(inv => inv.status !== "pending").length) * 100 || 0
            )}%
          </p>
        </div>
      </div>
    </div>
  );
} 