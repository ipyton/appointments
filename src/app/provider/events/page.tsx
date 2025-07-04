"use client";

import { useState, useEffect } from "react";
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
import Service from "@/apis/Service";

// Event interface for TypeScript
interface Arrangement {
  id: number;
  serviceId: number;
  index: number;
  startDate: string;
  templateId: number;
}

interface Event {
  id: number;
  name: string;
  description: string;
  price: number;
  enabled: boolean;
  isActive: boolean;
  providerId: string;
  createdAt: string;
  updatedAt: string | null;
  allowMultipleBookings: boolean;
  arrangements: Arrangement[];
}

export default function ProviderEventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Fetch events when component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Fetch events from the API
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await Service.getEvents();
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      // Ensure data is an array before setting it to state
      setEvents(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while fetching events');
      setEvents([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Filter events based on active status
  const filteredEvents = filter === "all" 
    ? events 
    : Array.isArray(events) ? events.filter(event => event.isActive === (filter === "active")) : [];

  // Toggle event active status
  const toggleEventStatus = async (id: number) => {
    try {
      const event = events.find(e => e.id === id);
      if (!event) return;
      
      // Update the event status via API
      const response = await Service.updateEvent(id.toString(), { 
        ...event, 
        isActive: !event.isActive 
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event status');
      }
      
      // Update local state
      setEvents(events.map(event => 
        event.id === id ? { ...event, isActive: !event.isActive } : event
      ));
    } catch (err) {
      console.error('Error updating event status:', err);
      alert('Failed to update event status');
    }
  };

  // Delete event
  const deleteEvent = async (id: number) => {
    try {
      const response = await Service.deleteEvent(id.toString());
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      // Update local state
      setEvents(events.filter(event => event.id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('Failed to delete event');
    }
  };

  // Count total available arrangements for an event
  const countAvailableArrangements = (event: Event) => {
    return event.arrangements ? event.arrangements.length : 0;
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
      variants={containerVariants as any}
    >
      <motion.div variants={itemVariants as any} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      {/* Loading state */}
      {loading && (
        <motion.div 
          variants={itemVariants as any}
          className="bg-white rounded-xl shadow-sm p-10 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Loading events...</h3>
            <p className="text-gray-500 mt-2">Please wait while we fetch your events.</p>
          </div>
        </motion.div>
      )}

      {/* Error state */}
      {!loading && error && (
        <motion.div 
          variants={itemVariants as any}
          className="bg-white rounded-xl shadow-sm p-10 text-center"
        >
          <div className="flex flex-col items-center">
            <div className="bg-red-100 p-3 rounded-full mb-3">
              <XMarkIcon className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Error loading events</h3>
            <p className="text-gray-500 mb-6">{error}</p>
            <button
              onClick={fetchEvents}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      {/* No events state */}
      {!loading && !error && filteredEvents.length === 0 && (
        <motion.div 
          variants={itemVariants as any}
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
      )}
      
      {/* Events list */}
      {!loading && !error && filteredEvents.length > 0 && (
        <motion.div 
          variants={containerVariants as any}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredEvents.map((event) => (
            <motion.div 
              key={event.id} 
              variants={itemVariants as any}
              className={`bg-white rounded-xl shadow-sm overflow-hidden border-t-4 ${
                event.isActive ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg text-gray-900">{event.name}</h3>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    event.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {event.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                
                <p className="mt-2 text-gray-600">{event.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                    ${event.price.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                    <UserGroupIcon className="h-3 w-3 mr-1" />
                    {countAvailableArrangements(event)} arrangements
                  </span>
                  {event.allowMultipleBookings && (
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      <UserGroupIcon className="h-3 w-3 mr-1" />
                      Multiple bookings
                    </span>
                  )}
                </div>

                <div className="mt-5">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                    Available Arrangements
                  </h4>
                  <div className="space-y-2">
                    {event.arrangements.slice(0, 3).map((arrangement, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-2">
                        <div className="flex items-center">
                          <TagIcon className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{formatDate(arrangement.startDate)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1 ml-6">
                          <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                            Template ID: {arrangement.templateId}
                          </span>
                          <span className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-600">
                            Index: {arrangement.index}
                          </span>
                        </div>
                      </div>
                    ))}
                    {event.arrangements.length > 3 && (
                      <div className="text-xs text-blue-600 font-medium ml-6">
                        +{event.arrangements.length - 3} more arrangements available
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
        variants={containerVariants as any}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants as any} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-4">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(events) ? events.length : 0}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants as any} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-lg mr-4">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Events</p>
              <p className="text-2xl font-bold text-gray-900">{Array.isArray(events) ? events.filter(event => event.isActive).length : 0}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants as any} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-2 rounded-lg mr-4">
              <UserGroupIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Arrangements</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.isArray(events) ? events.reduce((total, event) => total + countAvailableArrangements(event), 0) : 0}
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants as any} className="bg-white rounded-xl p-5 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 p-2 rounded-lg mr-4">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Avg. Price</p>
              <p className="text-2xl font-bold text-gray-900">
                ${Array.isArray(events) && events.length > 0 ? (events.reduce((total, event) => total + event.price, 0) / events.length).toFixed(2) : "0.00"}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
} 