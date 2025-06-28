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
  const [loading, setLoading] = useState(true);
  
  // Categories derived from event data
  const categories = [...new Set(MOCK_EVENTS.map(event => event.category))];
  
  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API fetch with timeout
    const timer = setTimeout(() => {
      setEvents(MOCK_EVENTS);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Available Events</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events by name, provider, or description..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-auto">
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e\")", backgroundPosition: "right 0.5rem center", backgroundRepeat: "no-repeat", backgroundSize: "1.5em 1.5em", paddingRight: "2.5rem" }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No events found</h3>
          <p className="text-yellow-700">No events match your search criteria. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Link href={`/user/events/${event.id}`} key={event.id} className="group">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 h-full flex flex-col">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <h2 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{event.provider}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.duration} minutes</span>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-medium text-blue-600">${event.price}</span>
                  <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors flex items-center">
                    Book Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 