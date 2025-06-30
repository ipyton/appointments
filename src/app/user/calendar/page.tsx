"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";

// Mock bookings data
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
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

// Helper function to generate calendar days
const generateCalendarDays = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days = [];
  
  // Add previous month's days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevMonthLastDay - i),
      isCurrentMonth: false,
      events: []
    });
  }
  
  // Add current month's days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: new Date(year, month, i),
      isCurrentMonth: true,
      events: []
    });
  }
  
  // Add next month's days to complete the grid (6 rows x 7 days = 42)
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
      events: []
    });
  }
  
  return days;
};

export default function CalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch user bookings
    // Simulating API fetch with timeout
    const timer = setTimeout(() => {
      setBookings(MOCK_BOOKINGS);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  useEffect(() => {
    const days = generateCalendarDays(currentYear, currentMonth);
    
    // Add bookings to calendar days
    days.forEach(day => {
      const dayStr = day.date.toISOString().split('T')[0];
      const dayBookings = bookings.filter(booking => booking.date === dayStr);
      day.events = dayBookings;
    });
    
    setCalendarDays(days);
  }, [currentYear, currentMonth, bookings]);
  
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const handleEventClick = (event: any) => {
    setSelectedEvent(event);
  };
  
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';
    }
  };
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 flex justify-between items-center border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
              <div className="flex items-center">
                <h2 className="text-xl font-semibold text-gray-900">{monthName} {currentYear}</h2>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={goToToday}
                  className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Today
                </button>
                <button 
                  onClick={goToPreviousMonth}
                  className="p-1.5 border border-gray-300 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={goToNextMonth}
                  className="p-1.5 border border-gray-300 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  aria-label="Next month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
              {weekDays.map(day => (
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading calendar...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`min-h-[100px] border-b border-r p-1.5 ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                    } ${
                      isToday(day.date) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`text-right mb-1.5 ${isToday(day.date) ? 'font-bold text-blue-600' : ''}`}>
                      {isToday(day.date) ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-600 text-white rounded-full text-sm">
                          {day.date.getDate()}
                        </span>
                      ) : (
                        <span className={`text-sm ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                          {day.date.getDate()}
                        </span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {day.events.map((event: any) => (
                        <button 
                          key={event.id} 
                          onClick={() => handleEventClick(event)}
                          className={`w-full text-left text-xs py-1 px-2 rounded-md truncate flex items-center space-x-1.5 border ${
                            getStatusStyles(event.status)
                          } transition-all shadow-sm hover:shadow`}
                          title={`${event.title} - ${event.time}`}
                        >
                          <span className={`block w-2 h-2 rounded-full flex-shrink-0 ${getStatusColor(event.status)}`}></span>
                          <span className="truncate">{event.time.split(' ')[0]} {event.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="sticky top-24">
            {selectedEvent ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
                  <button 
                    onClick={closeEventDetails}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                {/* Provider with avatar */}
                <div className="flex items-center mb-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-3 ring-2 ring-gray-200">
                    <Image 
                      src={selectedEvent.avatar} 
                      alt={selectedEvent.provider}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{selectedEvent.provider}</div>
                    <div className="text-xs text-gray-500">{selectedEvent.publisher}</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{selectedEvent.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{selectedEvent.time} ({selectedEvent.duration} mins)</span>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      selectedEvent.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800' 
                        : selectedEvent.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                  <button
                    className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 shadow-sm">
                <div className="flex justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-blue-800 mb-3 text-center">Event Details</h3>
                <p className="text-blue-700 text-center mb-4">
                  Select an event from the calendar to view its details here.
                </p>
                <div className="mt-6 text-center">
                  <Link href="/user/events" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm text-sm">
                    Book New Event
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-6 bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Quick Legend</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-500 mr-2"></span>
                  <span className="text-green-800">Confirmed</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
                  <span className="text-yellow-800">Pending</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span className="text-red-800">Cancelled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 