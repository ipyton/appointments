"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

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
  };

  // Count total available slots for an event
  const countAvailableSlots = (event) => {
    return event.dates.reduce((total, date) => total + date.slots.length, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Available Events</h1>
        <div className="flex space-x-2">
          <div className="flex space-x-2 mr-4">
            <button 
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter("active")}
              className={`px-3 py-1 rounded ${filter === "active" ? "bg-green-600 text-white" : "bg-gray-200"}`}
            >
              Active
            </button>
            <button 
              onClick={() => setFilter("inactive")}
              className={`px-3 py-1 rounded ${filter === "inactive" ? "bg-red-600 text-white" : "bg-gray-200"}`}
            >
              Inactive
            </button>
          </div>
          <Link
            href="/provider/create-event"
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create New Event
          </Link>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No events found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => (
            <div 
              key={event.id} 
              className={`bg-white rounded-lg shadow overflow-hidden border-l-4 ${
                event.isActive ? "border-green-500" : "border-gray-300"
              }`}
            >
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="font-medium text-lg">{event.title}</h3>
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {event.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                
                <p className="mt-2 text-gray-600">{event.description}</p>
                
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {event.duration} min
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    ${event.price.toFixed(2)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {countAvailableSlots(event)} available slots
                  </span>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-sm mb-2">Available Dates:</h4>
                  <div className="space-y-2">
                    {event.dates.slice(0, 3).map((dateInfo, index) => (
                      <div key={index} className="flex flex-wrap items-center">
                        <span className="text-sm font-medium mr-2">{dateInfo.date}:</span>
                        <div className="flex flex-wrap gap-1">
                          {dateInfo.slots.slice(0, 3).map((slot, slotIndex) => (
                            <span key={slotIndex} className="text-xs bg-gray-100 px-2 py-1 rounded">
                              {slot}
                            </span>
                          ))}
                          {dateInfo.slots.length > 3 && (
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                              +{dateInfo.slots.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {event.dates.length > 3 && (
                      <div className="text-xs text-gray-500">
                        +{event.dates.length - 3} more dates available
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between">
                  <div className="text-xs text-gray-500">
                    Created on {new Date(event.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => toggleEventStatus(event.id)}
                      className={`px-3 py-1 rounded text-xs ${
                        event.isActive 
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                          : "bg-green-100 text-green-800 hover:bg-green-200"
                      }`}
                    >
                      {event.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <Link
                      href={`/provider/events/edit/${event.id}`}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-xs"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => deleteEvent(event.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Total Events</h3>
          <p className="text-2xl font-bold">{events.length}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Active Events</h3>
          <p className="text-2xl font-bold">{events.filter(event => event.isActive).length}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Available Slots</h3>
          <p className="text-2xl font-bold">
            {events.reduce((total, event) => total + countAvailableSlots(event), 0)}
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 shadow-sm">
          <h3 className="font-medium">Avg. Price</h3>
          <p className="text-2xl font-bold">
            ${(events.reduce((total, event) => total + event.price, 0) / events.length).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
} 