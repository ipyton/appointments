"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Calendar from "@/apis/Calendar";

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg, DatesSetArg } from '@fullcalendar/core';

interface Booking {
  id: string;
  eventId: string;
  title: string;
  provider: string;
  publisher: string;
  startTime: string; // ISO string from backend
  endTime: string;   // ISO string from backend
  duration: number;
  status: string;
  avatar: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string;   // ISO string
  extendedProps: {
    provider: string;
    publisher: string;
    status: string;
    avatar: string;
    duration: number;
  };
  backgroundColor: string;
  borderColor: string;
  textColor: string;
}

type ViewType = "dayGridMonth" | "timeGridWeek";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [view, setView] = useState<ViewType>("dayGridMonth");
  const [isClient, setIsClient] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);
  
  // Track the last successful fetch to prevent duplicates
  const lastFetchKey = useRef<string>("");
  const isRequestInProgress = useRef<boolean>(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup function for debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);
  
  // Generate a unique key for fetch requests
  const generateFetchKey = useCallback((date: Date, calendarView: string): string => {
    let type = "month";
    if (calendarView === "timeGridWeek") type = "week";
    
    let requestDate = new Date(date);
    if (type === "month") {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      requestDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
    }
    
    return `${requestDate.toISOString().split('T')[0]}-${type}`;
  }, []);
  
  // Fetch calendar data from API with better duplicate prevention
  const fetchCalendarData = useCallback(async (date: Date, calendarView: string) => {
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set a new debounce timer
    debounceTimerRef.current = setTimeout(async () => {
      try {
        // Check if request is already in progress
        if (isRequestInProgress.current) {
          console.log("Request already in progress, skipping");
          return;
        }
        
        // Generate unique key for this fetch
        const fetchKey = generateFetchKey(date, calendarView);
        
        // Skip if we've already fetched this data
        if (lastFetchKey.current === fetchKey) {
          console.log("Skipping duplicate fetch request for key:", fetchKey);
          return;
        }
        
        // Mark request as in progress and update last fetch key
        isRequestInProgress.current = true;
        lastFetchKey.current = fetchKey;
        setLoading(true);
        setError(null);
        
        // Convert view type to match backend requirements
        let type = "month";
        if (calendarView === "timeGridWeek") type = "week";
        
        // Prepare request date
        let requestDate = new Date(date);
        if (type === "month") {
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const formattedDate = `${year}-${month.toString().padStart(2, '0')}-01`;
          requestDate = new Date(formattedDate);
        }
        
        console.log(`Making API request: date=${requestDate.toISOString()}, type=${type}, key=${fetchKey}`);
        const response = await Calendar.getCalendar(requestDate, type);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Calendar data fetched:", data);
          
          if (data && data.events && Array.isArray(data.events)) {
            // Use backend data directly - no time parsing or recalculation
            const apiBookings: Booking[] = data.events.map((event: any) => {
              const startDate = new Date(event.startTime);
              const endDate = new Date(event.endTime);
              
              // Calculate duration from the actual start/end times
              const durationMs = endDate.getTime() - startDate.getTime();
              const duration = Math.round(durationMs / 60000);
              
              return {
                id: event.id.toString(),
                eventId: event.id.toString(),
                title: event.title || "Untitled Event",
                provider: event.serviceName || "Service Provider",
                publisher: event.user?.name || "Service Provider",
                startTime: event.startTime, // Keep original ISO string
                endTime: event.endTime,     // Keep original ISO string
                duration: duration,
                status: event.status || "confirmed",
                avatar: event.user?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
              };
            });
            
            setBookings(apiBookings);
          } else {
            console.warn("API response doesn't match expected format:", data);
            setBookings([]);
          }
        } else {
          const errorText = await response.text();
          console.error("Failed to fetch calendar data:", errorText);
          setError(`Failed to load calendar data: ${response.status}`);
          setBookings([]);
        }
      } catch (error) {
        console.error("Error fetching calendar data:", error);
        setError(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setBookings([]);
      } finally {
        setLoading(false);
        isRequestInProgress.current = false;
      }
    }, 300);
  }, [generateFetchKey]);
  
  // Initial load
  useEffect(() => {
    setIsClient(true);
    fetchCalendarData(currentDate, view);
  }, [fetchCalendarData, currentDate, view]);
  
  // Convert bookings to FullCalendar events - use backend times directly
  useEffect(() => {
    const calendarEvents: CalendarEvent[] = bookings.map(booking => {
      const colors = getStatusColors(booking.status);
      
      return {
        id: booking.id,
        title: booking.title,
        start: booking.startTime, // Use backend time directly
        end: booking.endTime,     // Use backend time directly
        extendedProps: {
          provider: booking.provider,
          publisher: booking.publisher,
          status: booking.status,
          avatar: booking.avatar,
          duration: booking.duration
        },
        backgroundColor: colors.bgColor,
        borderColor: colors.borderColor,
        textColor: colors.textColor
      };
    });
    
    setEvents(calendarEvents);
  }, [bookings]);
  
  const getStatusColors = (status: string): { bgColor: string; borderColor: string; textColor: string } => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { bgColor: '#dcfce7', borderColor: '#22c55e', textColor: '#15803d' };
      case 'pending':
        return { bgColor: '#fef9c3', borderColor: '#eab308', textColor: '#854d0e' };
      case 'cancelled':
        return { bgColor: '#fee2e2', borderColor: '#ef4444', textColor: '#b91c1c' };
      default:
        return { bgColor: '#e0f2fe', borderColor: '#0ea5e9', textColor: '#0369a1' };
    }
  };
  
  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.id;
    const selectedBooking = bookings.find(booking => booking.id === eventId);
    
    if (selectedBooking) {
      setSelectedEvent(selectedBooking);
    }
  };
  
  const closeEventDetails = () => {
    setSelectedEvent(null);
  };

  // Handle view button clicks
  const handleViewChange = (newView: ViewType) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
  };


  // Error retry function
  const handleRetry = () => {
    setError(null);
    lastFetchKey.current = ""; // Reset to allow refetch
    fetchCalendarData(currentDate, view);
  };

  // Helper function to format time for display
  const formatDisplayTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Helper function to format date for display
  const formatDisplayDate = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isClient) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-500">Loading calendar...</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Calendar</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => handleViewChange('dayGridMonth')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'dayGridMonth' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
            <button 
              onClick={() => handleViewChange('timeGridWeek')}
              className={`px-4 py-2 rounded-md transition-colors ${
                view === 'timeGridWeek' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {error ? (
            <div className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <p className="text-lg font-medium">Error loading calendar</p>
              </div>
              <p className="text-gray-600 mb-4">{error}</p>
              <button 
                onClick={handleRetry}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your appointments...</p>
            </div>
          ) : (
            <div className="h-[800px]">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                initialDate={currentDate}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''
                }}
                events={events}
                eventClick={handleEventClick}
                height="100%"
                dayMaxEvents={true}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                slotMinTime="06:00:00"
                slotMaxTime="23:00:00"
                allDaySlot={false}
                nowIndicator={true}
                eventContent={(eventInfo) => {
                  const isMonthView = eventInfo.view.type === 'dayGridMonth';
                  
                  return (
                    <div className={`flex items-center p-1 ${isMonthView ? 'max-h-10 overflow-hidden' : ''}`}>
                      <div 
                        className="w-2 h-2 rounded-full mr-2 flex-shrink-0" 
                        style={{ 
                          backgroundColor: eventInfo.event.extendedProps.status === 'confirmed' 
                            ? '#22c55e' 
                            : eventInfo.event.extendedProps.status === 'pending'
                            ? '#eab308'
                            : '#ef4444'
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{eventInfo.event.title}</div>
                        {isMonthView ? (
                          <div className="text-xs opacity-75 truncate">{eventInfo.timeText}</div>
                        ) : (
                          <div className="text-xs opacity-75 truncate">
                            {eventInfo.timeText} • {eventInfo.event.extendedProps.provider}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }}
                eventMaxStack={3}
                moreLinkText={count => `+${count} more`}
              />
            </div>
          )}
        </div>
        
        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 pr-4">{selectedEvent.title}</h2>
                <button 
                  onClick={closeEventDetails}
                  className="text-gray-400 hover:text-gray-500 flex-shrink-0"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image 
                      src={selectedEvent.avatar} 
                      alt={selectedEvent.provider}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{selectedEvent.provider}</p>
                    <p className="text-sm text-gray-500 truncate">{selectedEvent.publisher}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Date</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {formatDisplayDate(selectedEvent.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Time</p>
                      <p className="font-medium text-gray-900 text-sm">
                        {formatDisplayTime(selectedEvent.startTime)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Duration</p>
                      <p className="font-medium text-gray-900 text-sm">{selectedEvent.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Status</p>
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
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                  <button 
                    onClick={closeEventDetails}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md border border-gray-300"
                  >
                    Close
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-md border border-red-300">
                    Cancel
                  </button>
                  <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}