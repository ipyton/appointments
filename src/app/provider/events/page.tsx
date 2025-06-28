"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

// Mock event data
const mockEvents = [
  {
    id: "1",
    title: "Hair Cut",
    description: "Regular haircut service, includes wash and styling.",
    duration: 60, // in minutes
    price: 45.00,
    dates: [
      { date: "2023-10-20", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { date: "2023-10-21", slots: ["09:00", "10:00", "11:00", "14:00", "15:00"] },
      { date: "2023-10-22", slots: ["10:00", "11:00", "14:00"] }
    ],
    isActive: true,
    createdAt: "2023-10-01T10:30:00Z"
  },
  {
    id: "2",
    title: "Massage Therapy",
    description: "Full body massage therapy session. Choose between deep tissue, Swedish, or relaxation massage.",
    duration: 90, // in minutes
    price: 85.00,
    dates: [
      { date: "2023-10-20", slots: ["10:00", "13:00", "15:00"] },
      { date: "2023-10-21", slots: ["10:00", "13:00", "15:00"] },
      { date: "2023-10-23", slots: ["09:00", "11:00", "14:00", "16:00"] }
    ],
    isActive: true,
    createdAt: "2023-10-02T14:15:00Z"
  },
  {
    id: "3",
    title: "Consultation",
    description: "Initial consultation for new clients to discuss needs and goals.",
    duration: 30, // in minutes
    price: 25.00,
    dates: [
      { date: "2023-10-19", slots: ["09:00", "09:30", "10:00", "16:00", "16:30"] },
      { date: "2023-10-20", slots: ["09:00", "09:30", "16:00", "16:30"] },
      { date: "2023-10-24", slots: ["09:00", "09:30", "10:00", "16:00", "16:30"] }
    ],
    isActive: true,
    createdAt: "2023-10-05T09:45:00Z"
  },
  {
    id: "4",
    title: "Hair Coloring",
    description: "Professional hair coloring service. Includes consultation, coloring, and styling.",
    duration: 120, // in minutes
    price: 120.00,
    dates: [
      { date: "2023-10-22", slots: ["10:00", "13:00"] },
      { date: "2023-10-23", slots: ["10:00", "13:00"] },
      { date: "2023-10-25", slots: ["10:00", "13:00"] }
    ],
    isActive: false,
    createdAt: "2023-10-08T11:20:00Z"
  }
];

export default function ProviderEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState(mockEvents);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  // Filter events based on active status
  const filteredEvents = filter === "all" 
    ? events 
    : events.filter(event => event.isActive === (filter === "active"));

  // Toggle event active status
  const toggleEventStatus = (id: string) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, isActive: !event.isActive } : event
    ));
  };

  // Delete event
  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    setConfirmDelete(null);
  };

  // Count total available slots for an event
  const countAvailableSlots = (event) => {
    return event.dates.reduce((total, date) => total + date.slots.length, 0);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
        type: "spring",
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
        <h1 className="text-2xl font-bold text-gray-900">My Available Events</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("active")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "active" ? "bg-green-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter("inactive")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${filter === "inactive" ? "bg-red-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100"}`}
            >
              Inactive
            </button>
          </div>
          <Link
            href="/provider/create-event"
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create New Event
          </Link>
        </div>
      </motion.div>

      {filteredEvents.length === 0 ? (
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl shadow-sm p-10 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-full mb-3">
              <CalendarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No events found</h3>
            <p className="text-gray-500 mb-6">No events match your current filter.</p>
            <Link
              href="/provider/create-event"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Create New Event
            </Link>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredEvents.map((event) => (
            <motion.div 
              key={event.id} 
              variants={itemVariants}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-t-4 ${
                event.isActive ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg text-gray-900">{event.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    event.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <p className="mt-2 text-gray-600">{event.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    {event.duration} min
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                    ${event.price.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    <UserGroupIcon className="h-3 w-3 mr-1" />
                    {countAvailableSlots(event)} slots
                  </span>
                </div>

                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Available Dates
                  </h4>
                  <div className="space-y-2">
                    {event.dates.slice(0, 3).map((dateInfo, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{formatDate(dateInfo.date)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 ml-6">
                          {dateInfo.slots.slice(0, 4).map((slot, slotIndex) => (
                            <span key={slotIndex} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                              {formatTime(slot)}
                            </span>
                          ))}
                          {dateInfo.slots.length > 4 && (
                            <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-blue-600 font-medium">
                              +{dateInfo.slots.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {event.dates.length > 3 && (
                      <div className="text-xs text-blue-600 font-medium ml-6">
                        +{event.dates.length - 3} more dates available
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between gap-3">
                  <div className="text-xs text-gray-500 flex items-center">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    Created on {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button 
                      onClick={() => toggleEventStatus(event.id)}
                      className={`inline-flex items-center px-3 py-1.5 rounded text-xs font-medium ${
                        event.isActive 
                          ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100" 
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {event.isActive ? (
                        <>
                          <XMarkIcon className="h-3 w-3 mr-1" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Activate
                        </>
                      )}
                    </button>
                    <Link
                      href={`/provider/events/edit/${event.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-xs font-medium"
                    >
                      <PencilIcon className="h-3 w-3 mr-1" />
                      Edit
                    </Link>
                    {confirmDelete === event.id ? (
                      <div className="flex items-center space-x-1">
                        <button 
                          onClick={() => deleteEvent(event.id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 text-xs font-medium"
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setConfirmDelete(null)}
                          className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setConfirmDelete(event.id)}
                        className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 text-xs font-medium"
                      >
                        <TrashIcon className="h-3 w-3 mr-1" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Summary Section */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{events.filter(event => event.isActive).length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-4">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Slots</p>
              <p className="text-2xl font-bold text-gray-900">
                {events.reduce((total, event) => total + countAvailableSlots(event), 0)}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-4">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(events.reduce((total, event) => total + event.price, 0) / events.length).toFixed(2)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 