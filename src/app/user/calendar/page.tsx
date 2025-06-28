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
  
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  useEffect(() => {
    // In a real app, this would be an API call to fetch user bookings
    // Simulating API fetch with timeout
    setTimeout(() => {
      setBookings(MOCK_BOOKINGS);
      setLoading(false);
    }, 500);
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
  
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Calendar</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-semibold">{monthName} {currentYear}</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={goToToday}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Today
            </button>
            <button 
              onClick={goToPreviousMonth}
              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => (
            <div key={day} className="text-center font-medium py-2 border-b">
              {day}
            </div>
          ))}
          
          {loading ? (
            <div className="col-span-7 h-96 flex items-center justify-center">
              <p className="text-gray-500">Loading calendar...</p>
            </div>
          ) : (
            calendarDays.map((day, index) => (
              <div 
                key={index} 
                className={`min-h-24 border p-1 ${
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                } ${
                  day.date.toDateString() === new Date().toDateString() ? 'border-blue-500 border-2' : ''
                }`}
              >
                <div className="text-right mb-1">
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {day.events.map((event: any) => (
                    <div 
                      key={event.id} 
                      className={`text-xs p-1 rounded truncate ${
                        event.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                      }`}
                      title={`${event.title} - ${event.time}`}
                    >
                      {event.time} - {event.title}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading appointments...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">You don't have any upcoming appointments.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{booking.title}</h3>
                  <p className="text-gray-600">Provider: {booking.provider}</p>
                  <p className="text-gray-600">
                    {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at {booking.time}
                  </p>
                  <p className="text-gray-600">Duration: {booking.duration} minutes</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 