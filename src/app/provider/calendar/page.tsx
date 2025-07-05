"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon,
  EnvelopeIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";

// FullCalendar imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DateSelectArg, EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';

// Interface for template time ranges
interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
  selected?: boolean;  // Added for multi-selection
}

// Interface for template
interface Template {
  name: string;
  timeRanges: TimeRange[];
}

// Interface for scheduled time range (for actual appointments)
interface ScheduledTimeRange {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  templateId?: string;
}

// FullCalendar event interface
interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps: {
    clientName?: string;
    clientEmail?: string;
    status?: string;
    type: 'appointment' | 'availability';
  };
  backgroundColor: string;
  borderColor: string;
}

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
  const [view, setView] = useState<"dayGridMonth" | "timeGridWeek" | "timeGridDay">("timeGridWeek");
  const [isClient, setIsClient] = useState(false);
  const calendarRef = useRef(null);
  
  // Template state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<TimeRange[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  
  // Scheduled time ranges
  const [scheduledTimeRanges, setScheduledTimeRanges] = useState<ScheduledTimeRange[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Set isClient to true on component mount
  useEffect(() => {
    setIsClient(true);
    
    // Load templates from localStorage
    const savedTemplates = localStorage.getItem('providerTemplates');
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error("Error loading templates:", e);
      }
    }
    
    // Load scheduled time ranges from localStorage
    const savedScheduledRanges = localStorage.getItem('scheduledTimeRanges');
    if (savedScheduledRanges) {
      try {
        setScheduledTimeRanges(JSON.parse(savedScheduledRanges));
      } catch (e) {
        console.error("Error loading scheduled time ranges:", e);
      }
    }
  }, []);
  
  // Save scheduled time ranges to localStorage when they change
  useEffect(() => {
    if (scheduledTimeRanges.length > 0) {
      localStorage.setItem('scheduledTimeRanges', JSON.stringify(scheduledTimeRanges));
    }
  }, [scheduledTimeRanges]);

  // Convert mock appointments and scheduled time ranges to FullCalendar events
  useEffect(() => {
    const appointmentEvents: CalendarEvent[] = mockAppointments.map(appointment => ({
      id: appointment.id,
      title: `${appointment.title} - ${appointment.clientName}`,
      start: `${appointment.date}T${appointment.startTime}`,
      end: `${appointment.date}T${appointment.endTime}`,
      extendedProps: {
        clientName: appointment.clientName,
        clientEmail: appointment.clientEmail,
        status: appointment.status,
        type: 'appointment'
      },
      backgroundColor: '#4f46e5', // indigo-600
      borderColor: '#4338ca', // indigo-700
    }));

    const availabilityEvents: CalendarEvent[] = scheduledTimeRanges.map(range => ({
      id: range.id,
      title: 'Available',
      start: `${range.date}T${range.startTime}`,
      end: `${range.date}T${range.endTime}`,
      extendedProps: {
        type: 'availability'
      },
      backgroundColor: '#10b981', // emerald-600
      borderColor: '#059669', // emerald-700
    }));

    setEvents([...appointmentEvents, ...availabilityEvents]);
  }, [mockAppointments, scheduledTimeRanges]);

  // Format date as YYYY-MM-DD
  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minutes} ${period}`;
  };

  // Apply template to selected days
  const applyTemplateToSelectedDays = () => {
    if (!selectedTemplate || selectedDays.length === 0) return;
    
    const newScheduledRanges: ScheduledTimeRange[] = [];
    
    // If in multi-select mode, only use selected time ranges
    const timeRangesToApply = isMultiSelectMode 
      ? selectedTemplate.timeRanges.filter(tr => selectedTimeRanges.some(str => str.id === tr.id))
      : selectedTemplate.timeRanges;
      
    selectedDays.forEach(day => {
      const dateStr = formatDate(day);
      
      timeRangesToApply.forEach(timeRange => {
        newScheduledRanges.push({
          id: `${dateStr}-${timeRange.id}`,
          date: dateStr,
          startTime: timeRange.startTime,
          endTime: timeRange.endTime,
          templateId: selectedTemplate.name
        });
      });
    });
    
    // Add the new scheduled ranges
    setScheduledTimeRanges(prev => [...prev, ...newScheduledRanges]);
    
    // Reset selections
    setSelectedDays([]);
    setSelectedTimeRanges([]);
    setIsTemplateMode(false);
  };

  // Toggle time range selection for multi-select mode
  const toggleTimeRangeSelection = (timeRange: TimeRange) => {
    if (!isMultiSelectMode) return;
    
    setSelectedTimeRanges(prev => {
      const isSelected = prev.some(tr => tr.id === timeRange.id);
      if (isSelected) {
        return prev.filter(tr => tr.id !== timeRange.id);
      } else {
        return [...prev, timeRange];
      }
    });
  };

  // Toggle day selection for template application
  const toggleDaySelection = (day: Date) => {
    if (!isTemplateMode) return;
    
    setSelectedDays(prev => {
      const dayStr = formatDate(day);
      const isSelected = prev.some(d => formatDate(d) === dayStr);
      
      if (isSelected) {
        return prev.filter(d => formatDate(d) !== dayStr);
      } else {
        return [...prev, day];
      }
    });
  };

  // Handle date click in FullCalendar
  const handleDateClick = (info: DateClickArg) => {
    if (isTemplateMode) {
      const clickedDate = new Date(info.date);
      toggleDaySelection(clickedDate);
    }
  };

  // Handle event click in FullCalendar
  const handleEventClick = (info: EventClickArg) => {
    const eventType = info.event.extendedProps.type;
    
    if (eventType === 'availability') {
      if (confirm('Do you want to remove this availability slot?')) {
        const eventId = info.event.id;
        setScheduledTimeRanges(prev => prev.filter(range => range.id !== eventId));
      }
    } else if (eventType === 'appointment') {
      alert(`
        Appointment: ${info.event.title}
        Client: ${info.event.extendedProps.clientName}
        Email: ${info.event.extendedProps.clientEmail}
        Status: ${info.event.extendedProps.status}
      `);
    }
  };

  // Create new availability slot
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (!isTemplateMode) {
      const title = prompt('Set availability title (or leave blank for "Available"):');
      if (title !== null) { // User didn't cancel
        const startDate = new Date(selectInfo.start);
        const endDate = new Date(selectInfo.end);
        const dateStr = formatDate(startDate);
        
        const startTimeHours = startDate.getHours().toString().padStart(2, '0');
        const startTimeMinutes = startDate.getMinutes().toString().padStart(2, '0');
        const startTime = `${startTimeHours}:${startTimeMinutes}`;
        
        const endTimeHours = endDate.getHours().toString().padStart(2, '0');
        const endTimeMinutes = endDate.getMinutes().toString().padStart(2, '0');
        const endTime = `${endTimeHours}:${endTimeMinutes}`;
        
        const newRange: ScheduledTimeRange = {
          id: `${dateStr}-${startTime}-${endTime}`,
          date: dateStr,
          startTime,
          endTime,
        };
        
        setScheduledTimeRanges(prev => [...prev, newRange]);
      }
    }
  };

  // Render templates section
  const renderTemplatesSection = () => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="font-semibold text-lg mb-3">Templates</h3>
      <div className="flex flex-wrap gap-2 mb-4">
        {templates.map((template, index) => (
          <button
            key={index}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTemplate?.name === template.name 
                ? "bg-indigo-600 text-white" 
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedTemplate(template)}
          >
            {template.name}
          </button>
        ))}
      </div>
      
      {selectedTemplate && (
        <div className="mb-4">
          <h4 className="font-medium text-sm text-gray-500 mb-2">Time Ranges:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedTemplate.timeRanges.map((timeRange) => (
              <div 
                key={timeRange.id}
                className={`
                  px-3 py-1 rounded-full text-sm border
                  ${isMultiSelectMode && selectedTimeRanges.some(tr => tr.id === timeRange.id)
                    ? "bg-indigo-100 border-indigo-300"
                    : "bg-white border-gray-200"
                  }
                `}
                onClick={() => toggleTimeRangeSelection(timeRange)}
              >
                {formatTime(timeRange.startTime)} - {formatTime(timeRange.endTime)}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-4">
        <button
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            isTemplateMode
              ? "bg-indigo-600 text-white"
              : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => setIsTemplateMode(!isTemplateMode)}
        >
          {isTemplateMode ? "Cancel Template Mode" : "Apply Template"}
        </button>
        
        {isTemplateMode && selectedTemplate && (
          <>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="multiSelect"
                checked={isMultiSelectMode}
                onChange={() => setIsMultiSelectMode(!isMultiSelectMode)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <label htmlFor="multiSelect" className="ml-2 text-sm text-gray-700">
                Select specific times
              </label>
            </div>
            
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                selectedDays.length > 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={applyTemplateToSelectedDays}
              disabled={selectedDays.length === 0}
            >
              Apply to {selectedDays.length} day{selectedDays.length !== 1 ? 's' : ''}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // If not client-side yet, render a loading state
  if (!isClient) {
    return <div className="p-8 text-center">Loading calendar...</div>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Provider Calendar</h1>
          <div className="flex gap-2">
            <Link
              href="/provider/create-event"
              className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Create Event
            </Link>
          </div>
        </div>
        
        {renderTemplatesSection()}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* FullCalendar Integration */}
          <div className="h-[800px]">
            {isClient && (
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,timeGridDay'
                }}
                events={events}
                selectable={!isTemplateMode}
                selectMirror={true}
                dayMaxEvents={true}
                weekends={true}
                initialDate={currentDate}
                select={handleDateSelect}
                eventClick={handleEventClick}
                dateClick={handleDateClick}
                height="100%"
                allDaySlot={false}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
                eventContent={(eventInfo) => {
                  return (
                    <>
                      <b>{eventInfo.timeText}</b>&nbsp;
                      <span>{eventInfo.event.title}</span>
                    </>
                  )
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 