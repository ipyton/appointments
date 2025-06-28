"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

// Mock bookings data - same as in calendar page
const MOCK_BOOKINGS = [
  {
    id: "b1",
    eventId: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    date: "2023-06-15",
    time: "10:00 AM",
    duration: 30,
    status: "confirmed",
    price: 75,
    location: "123 Health Street, Medical Center"
  },
  {
    id: "b2",
    eventId: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    date: "2023-06-16",
    time: "16:00 PM",
    duration: 60,
    status: "confirmed",
    price: 25,
    location: "789 Zen Street, Wellness Center"
  },
  {
    id: "b3",
    eventId: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    date: "2023-06-20",
    time: "14:00 PM",
    duration: 45,
    status: "pending",
    price: 50,
    location: "456 Beauty Avenue, Style District"
  }
];

// Mock past bookings
const MOCK_PAST_BOOKINGS = [
  {
    id: "pb1",
    eventId: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    date: "2023-05-10",
    time: "11:00 AM",
    duration: 30,
    status: "completed",
    price: 75,
    location: "123 Health Street, Medical Center"
  },
  {
    id: "pb2",
    eventId: "5",
    title: "House Cleaning",
    provider: "CleanHome Services",
    date: "2023-05-15",
    time: "09:00 AM",
    duration: 120,
    status: "completed",
    price: 100,
    location: "Your Home Address"
  }
];

export default function BookingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch user bookings
    // Simulating API fetch with timeout
    const timer = setTimeout(() => {
      setUpcomingBookings(MOCK_BOOKINGS);
      setPastBookings(MOCK_PAST_BOOKINGS);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would make an API call to cancel the booking
    if (confirm("Are you sure you want to cancel this booking?")) {
      setUpcomingBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: "cancelled" } 
            : booking
        )
      );
    }
  };
  
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ),
        label: 'Confirmed'
      },
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Pending'
      },
      completed: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        label: 'Completed'
      },
      cancelled: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ),
        label: 'Cancelled'
      }
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };
  
  const renderBookingsList = (bookings: any[], showCancelButton = false) => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      );
    }
    
    if (bookings.length === 0) {
      return (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No bookings found</h3>
          <p className="text-gray-600 mb-4">You don't have any {activeTab} bookings.</p>
          {activeTab === 'past' && (
            <Link 
              href="/user/events"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              Browse events to book an appointment
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                  <p className="text-gray-600 text-sm">Provider: {booking.provider}</p>
                </div>
                <div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                      <p className="text-sm text-gray-900">
                        {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        <br />
                        {booking.time} ({booking.duration} minutes)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Location</p>
                      <p className="text-sm text-gray-900">{booking.location}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-4 sm:mb-0">
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-lg font-semibold text-blue-600">${booking.price}</p>
                </div>
                
                {showCancelButton && booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="w-full sm:w-auto px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
                
                {!showCancelButton && booking.status === 'completed' && (
                  <button
                    className="w-full sm:w-auto px-4 py-2 border border-blue-300 text-blue-700 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Book Again
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings</h1>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'upcoming' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-6 py-3 border-b-2 font-medium text-sm ${
                activeTab === 'past' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </nav>
        </div>
        
        <div className="p-6">
          {activeTab === 'upcoming' ? (
            renderBookingsList(upcomingBookings, true)
          ) : (
            renderBookingsList(pastBookings)
          )}
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <Link 
          href="/user/events"
          className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Book New Appointment
        </Link>
      </div>
    </div>
  );
} 