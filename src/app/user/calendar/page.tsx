"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

// Mock bookings data
const MOCK_BOOKINGS = [
  {
    id: "b1",
    eventId: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    date: "2023-06-15",
    time: "10:00 AM",
    duration: 30,
    status: "confirmed"
  },
  {
    id: "b2",
    eventId: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    date: "2023-06-16",
    time: "16:00 PM",
    duration: 60,
    status: "confirmed"
  },
  {
    id: "b3",
    eventId: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    date: "2023-06-20",
    time: "14:00 PM",
    duration: 45,
    status: "pending"
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
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const today = new Date();
  const isToday = (date: Date) => {
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Calendar</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-900">{monthName} {currentYear}</h2>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={goToToday}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Today
                </button>
                <button 
                  onClick={goToPreviousMonth}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  aria-label="Previous month"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                <button 
                  onClick={goToNextMonth}
                  className="p-1 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
                <div key={day} className="text-center py-2 text-sm font-medium text-gray-500">
                  {day}
                </div>
              ))}
            </div>
            
            {loading ? (
              <div className="h-96 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
                  <p className="mt-4 text-gray-600">Loading calendar...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-7 auto-rows-fr">
                {calendarDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`min-h-[100px] border-b border-r p-1 ${
                      day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                    } ${
                      isToday(day.date) ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className={`text-right mb-1 ${isToday(day.date) ? 'font-bold text-blue-600' : ''}`}>
                      <span className={`text-sm ${isToday(day.date) ? 'bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center' : ''}`}>
                        {day.date.getDate()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {day.events.map((event: any) => (
                        <button 
                          key={event.id} 
                          onClick={() => handleEventClick(event)}
                          className={`w-full text-left text-xs p-1 rounded truncate flex items-center space-x-1 ${
                            event.status === 'confirmed' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                          }`}
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
        
        <div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h2>
            </div>
            
            <div className="divide-y divide-gray-200">
              {loading ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500">Loading appointments...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-gray-600">You don't have any upcoming appointments.</p>
                </div>
              ) : (
                bookings.map(booking => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start space-x-3">
                      <div className={`mt-1 w-3 h-3 rounded-full flex-shrink-0 ${getStatusColor(booking.status)}`}></div>
                      <div>
                        <h3 className="font-medium text-gray-900">{booking.title}</h3>
                        <p className="text-sm text-gray-600">Provider: {booking.provider}</p>
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>
                            {new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            {' at '}
                            {booking.time}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{booking.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <a href="/user/events" className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center justify-center">
                Book new appointment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Event details modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeEventDetails}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10 ${
                    selectedEvent.status === 'confirmed' ? 'bg-blue-100' : 'bg-yellow-100'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${
                      selectedEvent.status === 'confirmed' ? 'text-blue-600' : 'text-yellow-600'
                    }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      {selectedEvent.title}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">Provider: {selectedEvent.provider}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {selectedEvent.time}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Duration: {selectedEvent.duration} minutes</p>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          selectedEvent.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  View Details
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeEventDetails}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 