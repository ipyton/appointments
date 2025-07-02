"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// Define Event type
interface Event {
  id: string;
  title: string;
  provider: string;
  publisher: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  image: string;
  avatar: string;
}

// Mock event data
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    publisher: "Metro Health Clinic",
    category: "Healthcare",
    description: "Regular dental checkup and cleaning.",
    duration: 30,
    price: 75,
    image: "https://placehold.co/600x400?text=Dental+Checkup",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    publisher: "Modern Styles Inc.",
    category: "Beauty",
    description: "Professional haircut and styling services.",
    duration: 45,
    price: 50,
    image: "https://placehold.co/600x400?text=Haircut",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    publisher: "Mindfulness Group",
    category: "Fitness",
    description: "Beginner-friendly yoga class for relaxation and flexibility.",
    duration: 60,
    price: 25,
    image: "https://placehold.co/600x400?text=Yoga+Class",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "4",
    title: "Car Maintenance",
    provider: "Quick Auto Service",
    publisher: "City Auto Group",
    category: "Automotive",
    description: "Basic car maintenance including oil change and inspection.",
    duration: 60,
    price: 120,
    image: "https://placehold.co/600x400?text=Car+Maintenance",
    avatar: "https://randomuser.me/api/portraits/men/75.jpg"
  },
  {
    id: "5",
    title: "House Cleaning",
    provider: "CleanHome Services",
    publisher: "Urban Cleaning Solutions",
    category: "Home Services",
    description: "Professional house cleaning service for all room types.",
    duration: 120,
    price: 100,
    image: "https://placehold.co/600x400?text=House+Cleaning",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg"
  },
  {
    id: "6",
    title: "Financial Consultation",
    provider: "Money Matters Advisors",
    publisher: "Wealth Management Group",
    category: "Professional Services",
    description: "Personal financial planning and investment advice.",
    duration: 60,
    price: 150,
    image: "https://placehold.co/600x400?text=Financial+Consultation",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg"
  }
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
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
                          event.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.publisher.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || event.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Events</h1>
      
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-grow relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events by name, provider, or description..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="w-full md:w-64">
            <div className="relative">
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 appearance-none focus:ring-blue-500 focus:border-blue-500 transition-colors"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-14 h-14 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-medium text-amber-900 mb-2">No events found</h3>
          <p className="text-amber-800 text-lg">No events match your search criteria. Try adjusting your filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); setSelectedCategory(''); }}
            className="mt-4 px-4 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 transition-colors font-medium flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3.146 8.354a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708z" clipRule="evenodd" />
            </svg>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => (
            <Link href={`/user/events/${event.id}`} key={event.id} className="group">
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col transform group-hover:-translate-y-1">
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {event.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-grow">
                  <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">{event.title}</h2>
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  {/* Provider with avatar */}
                  <div className="flex items-center mb-3 bg-white p-3 rounded-lg border border-gray-200">
                    <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 ring-2 ring-gray-200">
                      <Image 
                        src={event.avatar} 
                        alt={event.provider}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">{event.provider}</div>
                      <div className="text-xs text-gray-600">{event.publisher}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{event.duration} minutes</span>
                  </div>
                </div>
                <div className="px-5 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
                  <span className="font-semibold text-blue-600">${event.price}</span>
                  <span className="text-sm text-white px-3 py-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                    Book Now
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      
      <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Event Booking Help
        </h2>
        <p className="text-blue-800 mb-2">
          Browse through our available events and click on any event card to see more details and available time slots.
        </p>
        <p className="text-blue-800">
          You can filter events by category or search for specific event types using the search box above.
        </p>
      </div>
    </div>
  );
} 