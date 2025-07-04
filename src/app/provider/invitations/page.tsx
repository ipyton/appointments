"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  EnvelopeIcon,
  CheckIcon,
  XMarkIcon,
  ChatBubbleLeftIcon,
  ChartBarIcon
} from "@heroicons/react/24/outline";

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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  // Format relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Invitations</h1>
        <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
          <button 
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "pending" ? "bg-yellow-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            Pending
          </button>
          <button 
            onClick={() => setFilter("accepted")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "accepted" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            Accepted
          </button>
          <button 
            onClick={() => setFilter("declined")}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "declined" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
          >
            Declined
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredInvitations.length === 0 ? (
          <div className="p-10 text-center">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 p-3 rounded-full mb-3">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No invitations found</h3>
              <p className="text-gray-500">No invitations match your current filter.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredInvitations.map((invitation) => (
              <motion.div 
                key={invitation.id} 
                variants={itemVariants}
                className="p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-lg text-gray-900">{invitation.eventTitle}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${invitation.status === "pending" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${invitation.status === "accepted" ? "bg-green-100 text-green-800" : ""}
                        ${invitation.status === "declined" ? "bg-red-100 text-red-800" : ""}
                      `}>
                        {invitation.status.charAt(0).toUpperCase() + invitation.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {formatDate(invitation.date)}
                      </div>
                      <div className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {formatTime(invitation.startTime)} - {formatTime(invitation.endTime)}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {invitation.clientName}
                      </div>
                      <div className="flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1 text-gray-500" />
                        {invitation.clientEmail}
                      </div>
                    </div>
                    
                    {invitation.message && (
                      <div className="mt-3 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 border border-gray-100">
                        <div className="flex items-center text-xs text-gray-500 mb-1">
                          <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                          Client message:
                        </div>
                        <p className="italic">{invitation.message}</p>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 mt-3 flex items-center">
                      <ClockIcon className="h-3 w-3 mr-1" />
                      Requested {formatRelativeTime(invitation.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-2 self-end md:self-center">
                    {invitation.status === "pending" ? (
                      <>
                        <button 
                          onClick={() => handleAccept(invitation.id)}
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          <CheckIcon className="h-4 w-4 mr-1" />
                          Accept
                        </button>
                        <button 
                          onClick={() => handleDecline(invitation.id)}
                          className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Decline
                        </button>
                      </>
                    ) : (
                      <div className={`text-center px-4 py-2 rounded-lg text-sm font-medium
                        ${invitation.status === "accepted" ? "bg-green-100 text-green-800" : ""}
                        ${invitation.status === "declined" ? "bg-red-100 text-red-800" : ""}
                      `}>
                        {invitation.status === "accepted" ? (
                          <span className="flex items-center justify-center">
                            <CheckIcon className="h-4 w-4 mr-1" />
                            Accepted
                          </span>
                        ) : (
                          <span className="flex items-center justify-center">
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Declined
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Summary Section */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Invitations</p>
              <p className="text-2xl font-bold text-gray-900">{invitations.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-4">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{invitations.filter(inv => inv.status === "pending").length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Acceptance Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(
                  (invitations.filter(inv => inv.status === "accepted").length / 
                  invitations.filter(inv => inv.status !== "pending").length) * 100 || 0
                )}%
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 