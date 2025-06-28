"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

// Mock event data
const MOCK_EVENTS = [
  {
    id: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    category: "Healthcare",
    description: "Regular dental checkup and cleaning.",
    duration: 30,
    price: 75,
    image: "https://placehold.co/600x400?text=Dental+Checkup"
  },
  {
    id: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    category: "Beauty",
    description: "Professional haircut and styling services.",
    duration: 45,
    price: 50,
    image: "https://placehold.co/600x400?text=Haircut"
  },
  {
    id: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    category: "Fitness",
    description: "Beginner-friendly yoga class for relaxation and flexibility.",
    duration: 60,
    price: 25,
    image: "https://placehold.co/600x400?text=Yoga+Class"
  },
  {
    id: "4",
    title: "Car Maintenance",
    provider: "Quick Auto Service",
    category: "Automotive",
    description: "Basic car maintenance including oil change and inspection.",
    duration: 60,
    price: 120,
    image: "https://placehold.co/600x400?text=Car+Maintenance"
  },
  {
    id: "5",
    title: "House Cleaning",
    provider: "CleanHome Services",
    category: "Home Services",
    description: "Professional house cleaning service for all room types.",
    duration: 120,
    price: 100,
    image: "https://placehold.co/600x400?text=House+Cleaning"
  },
  {
    id: "6",
    title: "Financial Consultation",
    provider: "Money Matters Advisors",
    category: "Professional Services",
    description: "Personal financial planning and investment advice.",
    duration: 60,
    price: 150,
    image: "https://placehold.co/600x400?text=Financial+Consultation"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Categories derived from event data
  const categories = [...new Set(MOCK_EVENTS.map(event => event.category))];
  
  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API fetch with timeout
    setTimeout(() => {
      setEvents(MOCK_EVENTS);
    }, 500);
  }, []);
  
  // Filter events based on search and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.provider.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Available Events</h1>
      
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-grow">
          <input
            type="text"
            placeholder="Search events..."
            className="w-full p-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <select
            className="w-full md:w-auto p-2 border border-gray-300 rounded-md"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>
      
      {events.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">No events found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Link href={`/user/events/${event.id}`} key={event.id} className="block">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                  <p className="text-gray-600 mb-2">{event.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">
                      {event.category}
                    </span>
                    <span className="font-semibold">${event.price}</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span>By {event.provider}</span>
                    <span className="mx-2">•</span>
                    <span>{event.duration} min</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 