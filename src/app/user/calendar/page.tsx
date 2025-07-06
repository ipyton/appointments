"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Calendar from "@/apis/Calendar";

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';

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

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
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

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedEvent, setSelectedEvent] = useState<Booking | null>(null);
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay">("dayGridMonth");
  const [isClient, setIsClient] = useState(false);
  const calendarRef = useRef<any>(null);
  
  useEffect(() => {
    setIsClient(true);
    fetchCalendarData(currentDate, view);
  }, []);
  
  // Fetch calendar data from API
  const fetchCalendarData = async (date: Date, calendarView: string) => {
    try {
      setLoading(true);
      
      // Convert view type to match backend requirements
      let type = "month";
      if (calendarView === "timeGridWeek") type = "week";
      if (calendarView === "timeGridDay") type = "day";
      
      // For month view, use the first day of the current month
      let requestDate = new Date(date);
      if (type === "month") {
        requestDate = new Date(date.getFullYear(), date.getMonth(), 1);
      }
      
      const response = await Calendar.getCalendar(requestDate, type);
      if (response.ok) {
        const data = await response.json();
        console.log("Calendar data fetched:", data);
        // For now, we'll still use mock data until you provide the return format
        setBookings(MOCK_BOOKINGS);
      } else {
        console.error("Failed to fetch calendar data:", await response.text());
        setBookings(MOCK_BOOKINGS); // Fallback to mock data
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
      setBookings(MOCK_BOOKINGS); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };
  
  // Update calendar view when view state changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
    }
  }, [view]);
  
  // Convert bookings to FullCalendar events
  useEffect(() => {
    const calendarEvents: CalendarEvent[] = bookings.map(booking => {
      // Parse time from "10:00 AM" format to hours and minutes
      const timeMatch = booking.time.match(/(\d+):(\d+)\s+(AM|PM)/i);
      
      if (!timeMatch) return null;
      
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const period = timeMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (period === "PM" && hours < 12) hours += 12;
      if (period === "AM" && hours === 12) hours = 0;
      
      // Format start time
      const startTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      
      // Calculate end time based on duration
      const endHours = Math.floor((hours * 60 + minutes + booking.duration) / 60) % 24;
      const endMinutes = (minutes + booking.duration) % 60;
      
      // Format end time
      const endTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Get color based on status
      const colors = getStatusColors(booking.status);
      
      return {
        id: booking.id,
        title: booking.title,
        start: `${booking.date}T${startTime}:00`,
        end: `${booking.date}T${endTime}:00`,
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
    }).filter(Boolean) as CalendarEvent[];
    
    setEvents(calendarEvents);
  }, [bookings]);
  
  const getStatusColors = (status: string): { bgColor: string; borderColor: string; textColor: string } => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return { bgColor: '#dcfce7', borderColor: '#22c55e', textColor: '#15803d' }; // Green
      case 'pending':
        return { bgColor: '#fef9c3', borderColor: '#eab308', textColor: '#854d0e' }; // Yellow
      case 'cancelled':
        return { bgColor: '#fee2e2', borderColor: '#ef4444', textColor: '#b91c1c' }; // Red
      default:
        return { bgColor: '#e0f2fe', borderColor: '#0ea5e9', textColor: '#0369a1' }; // Blue
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

  if (!isClient) {
    return <div className="p-8 text-center">Loading calendar...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Calendar</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('dayGridMonth')}
              className={`px-4 py-2 rounded-md ${view === 'dayGridMonth' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Month
            </button>
            <button 
              onClick={() => setView('timeGridWeek')}
              className={`px-4 py-2 rounded-md ${view === 'timeGridWeek' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Week
            </button>
            <button 
              onClick={() => setView('timeGridDay')}
              className={`px-4 py-2 rounded-md ${view === 'timeGridDay' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 border border-gray-300'}`}
            >
              Day
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading your appointments...</p>
            </div>
          ) : (
            <div className="h-[800px]">
                              <FullCalendar
                ref={calendarRef}
                datesSet={(dateInfo) => {
                  const newDate = dateInfo.start;
                  const newView = dateInfo.view.type;
                  setCurrentDate(newDate);
                  setView(newView as "dayGridMonth" | "timeGridWeek" | "timeGridDay");
                  fetchCalendarData(newDate, newView);
                }}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: ''  // We're using custom buttons above
                }}
                events={events}
                initialDate={currentDate}
                eventClick={handleEventClick}
                height="100%"
                dayMaxEvents={true}
                eventTimeFormat={{
                  hour: '2-digit',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                eventContent={(eventInfo) => {
                  return (
                    <>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: eventInfo.event.extendedProps.status === 'confirmed' ? '#22c55e' : '#eab308' }}></div>
                        <div>
                          <div className="font-semibold">{eventInfo.event.title}</div>
                          <div className="text-xs">{eventInfo.timeText} • {eventInfo.event.extendedProps.provider}</div>
                        </div>
                      </div>
                    </>
                  );
                }}
              />
            </div>
          )}
        </div>
        
        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button 
                  onClick={closeEventDetails}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image 
                      src={selectedEvent.avatar} 
                      alt={selectedEvent.provider}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedEvent.provider}</p>
                    <p className="text-sm text-gray-500">{selectedEvent.publisher}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-gray-900">{selectedEvent.time}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">{selectedEvent.duration} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedEvent.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedEvent.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4 flex justify-end space-x-3">
                  <button className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 rounded-md">
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