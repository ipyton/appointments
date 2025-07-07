"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Appointment from "@/apis/Appointment";

// Status codes mapping
const STATUS_MAP: Record<number, string> = {
  0: "pending",
  1: "confirmed",
  2: "completed",
  3: "cancelled"
};

// Default avatar for providers
const DEFAULT_AVATAR = "https://randomuser.me/api/portraits/lego/1.jpg";

// Mock bookings data - same as in calendar page
const MOCK_BOOKINGS = [
  {
    id: "b1",
    eventId: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    publisher: "Metro Health Clinic",
    date: "2023-06-15",
    time: "10:00 AM",
    duration: 30,
    status: "confirmed",
    price: 75,
    location: "123 Health Street, Medical Center",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "b2",
    eventId: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    publisher: "Mindfulness Group",
    date: "2023-06-16",
    time: "16:00 PM",
    duration: 60,
    status: "confirmed",
    price: 25,
    location: "789 Zen Street, Wellness Center",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg"
  },
  {
    id: "b3",
    eventId: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    publisher: "Modern Styles Inc.",
    date: "2023-06-20",
    time: "14:00 PM",
    duration: 45,
    status: "pending",
    price: 50,
    location: "456 Beauty Avenue, Style District",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

// Mock past bookings
const MOCK_PAST_BOOKINGS = [
  {
    id: "pb1",
    eventId: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    publisher: "Metro Health Clinic",
    date: "2023-05-10",
    time: "11:00 AM",
    duration: 30,
    status: "completed",
    price: 75,
    location: "123 Health Street, Medical Center",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: "pb2",
    eventId: "5",
    title: "House Cleaning",
    provider: "CleanHome Services",
    publisher: "Urban Cleaning Solutions",
    date: "2023-05-15",
    time: "09:00 AM",
    duration: 120,
    status: "completed",
    price: 100,
    location: "Your Home Address",
    avatar: "https://randomuser.me/api/portraits/women/23.jpg"
  }
];

export default function BookingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Helper function to calculate duration in minutes between two time strings (HH:MM:SS)
  const calculateDuration = (startTime: string, endTime: string): number => {
    const start = new Date(`1970-01-01T${startTime}Z`);
    const end = new Date(`1970-01-01T${endTime}Z`);
    return Math.round((end.getTime() - start.getTime()) / 60000); // Convert ms to minutes
  };
  
  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const response = await Appointment.getAppointments();
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      
      // Process the appointments data
      const processedBookings = data.map((booking: any) => {
        // Format date and time
        const bookingDate = booking.slot.date;
        const startTime = booking.slot.startTime;
        const endTime = booking.slot.endTime;
        
        // Format status
        const status = STATUS_MAP[booking.status] || "pending";
        
        return {
          id: booking.id,
          eventId: booking.serviceId,
          title: booking.service.name,
          provider: booking.service.providerId, // This might need to be replaced with actual provider name
          publisher: "", // This might need to be populated if available
          date: bookingDate,
          startTime: startTime,
          endTime: endTime,
          time: startTime, // For backward compatibility
          duration: calculateDuration(startTime, endTime),
          status: status,
          price: booking.service.price,
          location: "", // This might need to be populated if available
          avatar: DEFAULT_AVATAR, // This might need to be replaced with actual provider avatar
          description: booking.service.description,
          notes: booking.notes,
          createdAt: booking.createdAt,
          contactEmail: booking.contactEmail,
          contactPhone: booking.contactPhone
        };
      });
      
      // Separate upcoming and past bookings based on date
      const now = new Date();
      const upcoming: any[] = [];
      const past: any[] = [];
      
      processedBookings.forEach((booking: any) => {
        const bookingDate = new Date(booking.date);
        if (bookingDate >= now || booking.status === 'pending' || booking.status === 'confirmed') {
          upcoming.push(booking);
        } else {
          past.push(booking);
        }
      });
      
      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      // Fallback to empty arrays if API fails
      setUpcomingBookings([]);
      setPastBookings([]);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user) {
      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user]);
  
  const handleCancelBooking = async (bookingId: string) => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      try {
        const response = await Appointment.cancelAppointment(bookingId);
        
        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }
        
        // Update local state to reflect the change
        setUpcomingBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status: "cancelled" } 
              : booking
          )
        );
      } catch (error) {
        console.error('Error cancelling booking:', error);
        alert('Failed to cancel booking. Please try again later.');
      }
    }
  };
  
  const getStatusBadge = (status: string) => {
    type BookingStatus = 'confirmed' | 'pending' | 'completed' | 'cancelled';
    
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
    
    const config = statusConfig[status as BookingStatus] || statusConfig.pending;
    
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
                  <p className="text-sm text-gray-500">{booking.description}</p>
                </div>
                <div>
                  {getStatusBadge(booking.status)}
                </div>
              </div>

              {/* Provider with avatar */}
              <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <div className="relative h-14 w-14 rounded-full overflow-hidden mr-3 ring-2 ring-gray-200">
                  <Image 
                    src={booking.avatar} 
                    alt={booking.title}
                    width={56}
                    height={56}
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="text-base font-medium text-gray-900">{booking.title}</div>
                  <div className="text-sm text-gray-500">Created on {new Date(booking.createdAt).toLocaleDateString()}</div>
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
                        {booking.startTime} - {booking.endTime} ({booking.duration} minutes)
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                      <p className="text-sm text-gray-900">
                        {booking.contactEmail || "No email provided"}
                        {booking.contactPhone && <><br />{booking.contactPhone}</>}
                      </p>
                    </div>
                  </div>
                </div>
                
                {booking.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">Notes</p>
                    <p className="text-sm text-gray-900">{booking.notes}</p>
                  </div>
                )}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <button 
          onClick={fetchBookings}
          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? (
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
          Refresh
        </button>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none ${
              activeTab === 'upcoming' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Upcoming Bookings
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-4 px-6 text-center font-medium text-sm focus:outline-none ${
              activeTab === 'past' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Past Bookings
          </button>
        </div>
        
        <div className="p-6">
          {activeTab === 'upcoming' 
            ? renderBookingsList(upcomingBookings, true)
            : renderBookingsList(pastBookings)
          }
        </div>
      </div>
      
      <div className="flex justify-center">
        <Link
          href="/user/events"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
} 