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
    setTimeout(() => {
      setUpcomingBookings(MOCK_BOOKINGS);
      setPastBookings(MOCK_PAST_BOOKINGS);
      setLoading(false);
    }, 500);
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
  
  const renderBookingsList = (bookings: any[], showCancelButton = false) => {
    if (loading) {
      return <p className="text-gray-500 py-8 text-center">Loading bookings...</p>;
    }
    
    if (bookings.length === 0) {
      return <p className="text-gray-500 py-8 text-center">No bookings found.</p>;
    }
    
    return (
      <div className="space-y-4">
        {bookings.map(booking => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{booking.title}</h3>
                  <p className="text-gray-600">Provider: {booking.provider}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                  booking.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Time:</span> {booking.time}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Duration:</span> {booking.duration} minutes
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">
                    <span className="font-medium">Price:</span> ${booking.price}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Location:</span> {booking.location}
                  </p>
                </div>
              </div>
              
              {showCancelButton && booking.status !== 'cancelled' && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="border-b">
          <div className="flex">
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === 'upcoming' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('upcoming')}
            >
              Upcoming
            </button>
            <button
              className={`px-4 py-3 font-medium ${
                activeTab === 'past' 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('past')}
            >
              Past
            </button>
          </div>
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
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Book New Appointment
        </Link>
      </div>
    </div>
  );
} 