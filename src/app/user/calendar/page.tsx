"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Booking {
  id: string;
  eventId: string;
  title: string;
  provider: string;
  publisher: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  avatar: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  events: Booking[];
}

interface HoverPosition {
  x: number;
  y: number;
}

// Mock bookings data
const MOCK_BOOKINGS: Booking[] = [
  {
    id: "b1",
    eventId: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    publisher: "Metro Health Clinic",
    date: "2024-07-15",
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
    date: "2024-07-16",
    time: "4:00 PM",
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
    date: "2024-07-20",
    time: "2:00 PM",
    duration: 45,
    status: "pending",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: "b4",
    eventId: "4",
    title: "Team Meeting",
    provider: "Office",
    publisher: "Company Ltd",
    date: "2024-07-22",
    time: "9:00 AM",
    duration: 90,
    status: "confirmed",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg"
  },
  {
    id: "b5",
    eventId: "5",
    title: "Lunch with Sarah",
    provider: "Cafe Central",
    publisher: "Personal",
    date: "2024-07-25",
    time: "12:30 PM",
    duration: 60,
    status: "confirmed",
    avatar: "https://randomuser.me/api/portraits/women/22.jpg"
  }
];

// Helper function to generate calendar days
const generateCalendarDays = (year: number, month: number): CalendarDay[] => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();
  
  const days: CalendarDay[] = [];
  
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
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<Booking | null>(null);
  const [hoverPosition, setHoverPosition] = useState<HoverPosition>({ x: 0, y: 0 });
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  useEffect(() => {
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
  
  const handleEventClick = (event: Booking) => {
    setSelectedEvent(event);
  };
  
  const handleEventHover = (event: Booking, e: React.MouseEvent) => {
    setHoveredEvent(event);
    const rect = e.currentTarget.getBoundingClientRect();
    setHoverPosition({
      x: rect.left - 20,
      y: rect.top - 10
    });
  };
  
  const handleEventLeave = () => {
    setHoveredEvent(null);
  };
  
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-500';
      case 'pending':
        return 'bg-amber-500';
      case 'cancelled':
        return 'bg-rose-500';
      default:
        return 'bg-slate-500';
    }
  };
  
  const getEventStyles = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-gradient-to-r from-emerald-400 to-emerald-500 text-white border-emerald-300 shadow-emerald-200';
      case 'pending':
        return 'bg-gradient-to-r from-amber-400 to-amber-500 text-white border-amber-300 shadow-amber-200';
      case 'cancelled':
        return 'bg-gradient-to-r from-rose-400 to-rose-500 text-white border-rose-300 shadow-rose-200';
      default:
        return 'bg-gradient-to-r from-slate-400 to-slate-500 text-white border-slate-300 shadow-slate-200';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            My Calendar
          </h1>
          <p className="text-slate-600">Manage your appointments and events</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden shadow-xl shadow-slate-200/50">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-700 text-white">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold">{monthName} {currentYear}</h2>
                  </div>
                  <div className="flex space-x-3">
                    <button 
                      onClick={goToToday}
                      className="px-4 py-2 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/20"
                    >
                      Today
                    </button>
                    <button 
                      onClick={goToPreviousMonth}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/20"
                      aria-label="Previous month"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={goToNextMonth}
                      className="p-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-all duration-200 border border-white/20"
                      aria-label="Next month"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Week days header */}
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200">
                {weekDays.map(day => (
                  <div key={day} className="text-center py-4 text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              
              {loading ? (
                <div className="h-96 flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-slate-200 rounded-full border-t-blue-500 animate-spin"></div>
                    <p className="mt-4 text-slate-600 font-medium">Loading calendar...</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-7 divide-x divide-slate-200">
                  {calendarDays.map((day, index) => (
                    <div 
                      key={index} 
                      className={`h-32 border-b border-slate-200 p-2 relative group transition-all duration-200 ${
                        day.isCurrentMonth 
                          ? 'bg-white hover:bg-slate-50' 
                          : 'bg-slate-50 hover:bg-slate-100'
                      } ${
                        isToday(day.date) ? 'bg-blue-50 ring-2 ring-blue-200 ring-inset' : ''
                      }`}
                    >
                      {/* Date number */}
                      <div className="flex justify-end mb-1">
                        {isToday(day.date) ? (
                          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-bold shadow-lg">
                            {day.date.getDate()}
                          </div>
                        ) : (
                          <div className={`text-sm font-medium ${
                            day.isCurrentMonth ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {day.date.getDate()}
                          </div>
                        )}
                      </div>
                      
                      {/* Events */}
                      <div className="space-y-1">
                        {day.events.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={event.id}
                            onClick={() => handleEventClick(event)}
                            onMouseEnter={(e) => handleEventHover(event, e)}
                            onMouseLeave={handleEventLeave}
                            className={`
                              relative cursor-pointer text-xs font-medium py-1 px-2 rounded-md 
                              transform transition-all duration-200 hover:scale-105 hover:z-10
                              ${getEventStyles(event.status)}
                              shadow-sm hover:shadow-md
                              border border-white/20
                            `}
                            style={{
                              animationDelay: `${eventIndex * 100}ms`
                            }}
                          >
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-white/80 rounded-full flex-shrink-0"></div>
                              <div className="truncate font-medium">
                                {event.time.split(' ')[0]} {event.title}
                              </div>
                            </div>
                          </div>
                        ))}
                        {day.events.length > 3 && (
                          <div className="text-xs text-slate-500 font-medium px-2 py-1 bg-slate-100 rounded-md">
                            +{day.events.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {selectedEvent ? (
                <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-bold text-slate-900">{selectedEvent.title}</h3>
                    <button 
                      onClick={closeEventDetails}
                      className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Provider with avatar */}
                  <div className="flex items-center mb-6 bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-xl border border-slate-200">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4 ring-2 ring-white shadow-md">
                      <img 
                        src={selectedEvent.avatar} 
                        alt={selectedEvent.provider}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{selectedEvent.provider}</div>
                      <div className="text-sm text-slate-600">{selectedEvent.publisher}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center text-slate-600">
                      <svg className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-medium">{selectedEvent.date}</span>
                    </div>
                    
                    <div className="flex items-center text-slate-600">
                      <svg className="h-5 w-5 mr-3 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">{selectedEvent.time} ({selectedEvent.duration} mins)</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedEvent.status === 'confirmed' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : selectedEvent.status === 'pending' 
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                      }`}>
                        {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-200 flex space-x-3">
                    <button className="flex-1 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium">
                      Cancel
                    </button>
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg">
                      Reschedule
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200 rounded-2xl p-6 shadow-xl shadow-blue-200/50">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
                      <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-blue-900 mb-2">Event Details</h3>
                    <p className="text-blue-700 mb-4">
                      Click on any event to view its details here.
                    </p>
                    <button className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-lg font-medium">
                      Book New Event
                      <svg className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-xl shadow-slate-200/50">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Status Legend</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 mr-3 shadow-sm"></div>
                    <span className="text-slate-700 font-medium">Confirmed</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 mr-3 shadow-sm"></div>
                    <span className="text-slate-700 font-medium">Pending</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 mr-3 shadow-sm"></div>
                    <span className="text-slate-700 font-medium">Cancelled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredEvent && (
        <div 
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${hoverPosition.x}px`,
            top: `${hoverPosition.y}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className="bg-slate-900 text-white p-4 rounded-xl shadow-2xl border border-slate-700 max-w-xs">
            <div className="flex items-center mb-3">
              <img 
                src={hoveredEvent.avatar} 
                alt={hoveredEvent.provider}
                className="w-8 h-8 rounded-full mr-3 ring-2 ring-white/20"
              />
              <div>
                <div className="font-semibold text-sm">{hoveredEvent.title}</div>
                <div className="text-xs text-slate-300">{hoveredEvent.provider}</div>
              </div>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex items-center text-slate-300">
                <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {hoveredEvent.time} ({hoveredEvent.duration} mins)
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  hoveredEvent.status === 'confirmed' 
                    ? 'bg-emerald-500/20 text-emerald-300' 
                    : hoveredEvent.status === 'pending' 
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                }`}>
                  {hoveredEvent.status.charAt(0).toUpperCase() + hoveredEvent.status.slice(1)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}