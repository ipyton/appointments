"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon
} from "@heroicons/react/24/outline";

// Mock appointment data
const mockAppointments = [
  {
    id: "1",
    title: "Hair Cut",
    clientName: "John Doe",
    clientEmail: "john@example.com",
    date: "2023-10-15",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed"
  },
  {
    id: "2",
    title: "Massage Therapy",
    clientName: "Jane Smith",
    clientEmail: "jane@example.com",
    date: "2023-10-15",
    startTime: "13:00",
    endTime: "14:30",
    status: "confirmed"
  },
  {
    id: "3",
    title: "Consultation",
    clientName: "Mike Johnson",
    clientEmail: "mike@example.com",
    date: "2023-10-16",
    startTime: "09:00",
    endTime: "09:30",
    status: "confirmed"
  }
];

export default function ProviderCalendarPage() {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Generate dates for the current week
  const generateWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const weekDays = generateWeekDays();

  // Time slots from 8 AM to 6 PM
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Get appointments for a specific day and time
  const getAppointmentsForSlot = (day: Date, time: string) => {
    const dayStr = formatDate(day);
    return mockAppointments.filter(
      app => app.date === dayStr && app.startTime === time
    );
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  // Navigate to next week
  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Format time to display in 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Appointment Calendar</h1>
        <div className="flex space-x-2 bg-white p-1 rounded-lg shadow-sm">
          <button 
            onClick={() => setView("day")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === "day" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Day
          </button>
          <button 
            onClick={() => setView("week")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === "week" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Week
          </button>
          <button 
            onClick={() => setView("month")}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              view === "month" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            Month
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
        <button 
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Previous week"
        >
          <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
        </button>
        
        <div className="text-center">
          <h2 className="text-lg font-medium text-gray-900">
            {weekDays[0].toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          <p className="text-sm text-gray-500">
            {weekDays[0].toLocaleDateString('en-US', { day: 'numeric' })} - {weekDays[6].toLocaleDateString('en-US', { day: 'numeric' })}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={goToToday}
            className="px-4 py-1.5 rounded-md bg-blue-100 text-blue-700 text-sm font-medium hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          <button 
            onClick={goToNextWeek}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Next week"
          >
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="py-3 px-4 text-center font-medium bg-gray-50 text-gray-500 border-r"></div>
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`py-3 px-2 text-center font-medium ${
                isToday(day) ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
              } ${index < 6 ? 'border-r' : ''}`}
            >
              <div className="text-xs uppercase tracking-wide">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</div>
              <div className={`text-lg ${isToday(day) ? 'text-blue-700' : 'text-gray-900'}`}>
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="divide-y">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8">
              <div className="py-3 px-4 text-center text-sm text-gray-500 bg-gray-50 border-r flex items-center justify-center">
                <span className="font-medium">{formatTime(time)}</span>
              </div>
              {weekDays.map((day, dayIndex) => {
                const appointments = getAppointmentsForSlot(day, time);
                return (
                  <div 
                    key={dayIndex} 
                    className={`py-2 px-2 border-r min-h-[80px] ${
                      isToday(day) ? 'bg-blue-50/30' : ''
                    } ${dayIndex === 6 ? 'border-r-0' : ''}`}
                  >
                    {appointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="bg-white border-l-4 border-blue-600 p-2 text-xs rounded-md shadow-sm mb-1 hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium text-gray-900 mb-1">{appointment.title}</div>
                        <div className="flex items-center text-gray-600 mb-0.5">
                          <UserIcon className="h-3 w-3 mr-1" />
                          <span>{appointment.clientName}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Appointment List */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
        <h2 className="text-lg font-medium mb-4 flex items-center text-gray-900">
          <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
          Upcoming Appointments
        </h2>
        <div className="divide-y">
          {mockAppointments.length > 0 ? (
            mockAppointments.map((appointment) => (
              <div key={appointment.id} className="py-4 flex justify-between items-center hover:bg-gray-50 rounded-lg px-3 -mx-3 transition-colors">
                <div className="flex items-start space-x-4">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-700 hidden sm:flex">
                    <CalendarIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{appointment.title}</div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      {new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      <span className="mx-1">•</span>
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {appointment.clientName}
                      <span className="mx-1">•</span>
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {appointment.clientEmail}
                    </div>
                  </div>
                </div>
                <div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500">
              No upcoming appointments
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
} 