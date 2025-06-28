"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
    return `${hour}:00`;
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Appointment Calendar</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => setView("day")}
            className={`px-3 py-1 rounded ${view === "day" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Day
          </button>
          <button 
            onClick={() => setView("week")}
            className={`px-3 py-1 rounded ${view === "week" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Week
          </button>
          <button 
            onClick={() => setView("month")}
            className={`px-3 py-1 rounded ${view === "month" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Month
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button 
          onClick={goToPreviousWeek}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Previous Week
        </button>
        <button 
          onClick={goToToday}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Today
        </button>
        <button 
          onClick={goToNextWeek}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
        >
          Next Week
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="py-2 px-3 text-center font-medium bg-gray-50"></div>
          {weekDays.map((day, index) => (
            <div key={index} className="py-2 px-3 text-center font-medium bg-gray-50">
              <div>{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day.getDay()]}</div>
              <div>{day.getDate()}</div>
            </div>
          ))}
        </div>

        {/* Calendar Body */}
        <div className="divide-y">
          {timeSlots.map((time, timeIndex) => (
            <div key={timeIndex} className="grid grid-cols-8">
              <div className="py-3 px-2 text-center text-sm text-gray-500">
                {time}
              </div>
              {weekDays.map((day, dayIndex) => {
                const appointments = getAppointmentsForSlot(day, time);
                return (
                  <div key={dayIndex} className="py-1 px-1 border-l min-h-[60px]">
                    {appointments.map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="bg-blue-100 border-l-4 border-blue-600 p-1 text-xs rounded mb-1"
                      >
                        <div className="font-medium">{appointment.title}</div>
                        <div>{appointment.clientName}</div>
                        <div>{`${appointment.startTime} - ${appointment.endTime}`}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Appointment List */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium mb-4">Upcoming Appointments</h2>
        <div className="divide-y">
          {mockAppointments.map((appointment) => (
            <div key={appointment.id} className="py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{appointment.title}</div>
                <div className="text-sm text-gray-600">
                  {appointment.date} • {appointment.startTime} - {appointment.endTime}
                </div>
                <div className="text-sm">{appointment.clientName} ({appointment.clientEmail})</div>
              </div>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {appointment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 