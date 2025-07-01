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
  
  // Template state
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedDays, setSelectedDays] = useState<Date[]>([]);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [draggedTimeRange, setDraggedTimeRange] = useState<TimeRange | null>(null);
  const [selectedTimeRanges, setSelectedTimeRanges] = useState<TimeRange[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [sourceDay, setSourceDay] = useState<Date | null>(null);
  
  // Scheduled time ranges
  const [scheduledTimeRanges, setScheduledTimeRanges] = useState<ScheduledTimeRange[]>([]);
  
  // Drag and drop refs
  const dragTimeRangeRef = useRef<HTMLDivElement | null>(null);

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

  // Get scheduled time ranges for a specific day and time
  const getScheduledTimeRangesForSlot = (day: Date, time: string) => {
    const dayStr = formatDate(day);
    return scheduledTimeRanges.filter(
      range => range.date === dayStr && range.startTime.startsWith(time.split(':')[0])
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

  // Enhanced apply template function
  const applyTemplateToSelectedDays = () => {
    if (!selectedTemplate || selectedDays.length === 0) {
      alert("Please select a template and at least one day");
      return;
    }
    
    // Create new scheduled time ranges for each selected day
    const newScheduledRanges: ScheduledTimeRange[] = [];
    
    selectedDays.forEach(day => {
      const dayStr = formatDate(day);
      
      selectedTemplate.timeRanges.forEach(range => {
        newScheduledRanges.push({
          id: `${dayStr}-${range.id}`,
          date: dayStr,
          startTime: range.startTime,
          endTime: range.endTime,
          templateId: selectedTemplate.name
        });
      });
    });
    
    // Add the new scheduled ranges to the existing ones
    setScheduledTimeRanges([...scheduledTimeRanges, ...newScheduledRanges]);
    
    console.log("Applied template", selectedTemplate.name, "to days:", selectedDays.map(formatDate));
    
    // Reset selection
    setSelectedTemplate(null);
    setSelectedDays([]);
    setIsTemplateMode(false);
  };

  // New function to toggle time range selection
  const toggleTimeRangeSelection = (timeRange: TimeRange) => {
    if (isMultiSelectMode) {
      const isSelected = selectedTimeRanges.some(range => range.id === timeRange.id);
      
      if (isSelected) {
        setSelectedTimeRanges(selectedTimeRanges.filter(range => range.id !== timeRange.id));
      } else {
        setSelectedTimeRanges([...selectedTimeRanges, timeRange]);
      }
    } else {
      setSelectedTimeRanges([timeRange]);
    }
  };

  const toggleDaySelection = (day: Date) => {
    const dateStr = formatDate(day);
    const isSelected = selectedDays.some(d => formatDate(d) === dateStr);
    
    if (isSelected) {
      setSelectedDays(selectedDays.filter(d => formatDate(d) !== dateStr));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Enhanced drag functions
  const handleDragStart = (timeRange: TimeRange, day: Date) => {
    if (isMultiSelectMode && selectedTimeRanges.length > 0) {
      // If in multi-select mode and there are selected time ranges, drag all selected ranges
      setDraggedTimeRange(timeRange);
      setSourceDay(day);
    } else {
      // Otherwise just drag the single time range
      setDraggedTimeRange(timeRange);
      setSourceDay(day);
      // Clear any existing selections if not in multi-select mode
      if (!isMultiSelectMode) {
        setSelectedTimeRanges([]);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, day: Date, time: string) => {
    e.preventDefault();
  };

  // Function to adjust time based on the target slot
  const adjustTimeToTargetSlot = (originalTime: string, targetTime: string) => {
    const originalHour = parseInt(originalTime.split(':')[0], 10);
    const originalMinute = parseInt(originalTime.split(':')[1], 10);
    const targetHour = parseInt(targetTime.split(':')[0], 10);
    
    // Keep the same minute, but use the target hour
    return `${targetHour.toString().padStart(2, '0')}:${originalMinute.toString().padStart(2, '0')}`;
  };

  const handleDrop = (e: React.DragEvent, day: Date, time: string) => {
    e.preventDefault();
    if (!draggedTimeRange) return;
    
    const sourceDayStr = sourceDay ? formatDate(sourceDay) : '';
    const targetDayStr = formatDate(day);
    
    // Don't do anything if dropping on the same day
    if (sourceDayStr === targetDayStr) return;
    
    console.log("Dropped time range(s) from", sourceDayStr, "to", targetDayStr);
    
    const newScheduledRanges: ScheduledTimeRange[] = [];
    
    if (isMultiSelectMode && selectedTimeRanges.length > 0) {
      // Copy all selected time ranges to the target day
      console.log("Copying multiple time ranges:", selectedTimeRanges.length);
      
      selectedTimeRanges.forEach(range => {
        // Adjust the time to match the target slot's hour
        const adjustedStartTime = adjustTimeToTargetSlot(range.startTime, time);
        
        // Calculate the duration of the original time range
        const startHour = parseInt(range.startTime.split(':')[0], 10);
        const startMinute = parseInt(range.startTime.split(':')[1], 10);
        const endHour = parseInt(range.endTime.split(':')[0], 10);
        const endMinute = parseInt(range.endTime.split(':')[1], 10);
        
        const durationMinutes = 
          (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
        
        // Calculate the adjusted end time
        const adjustedStartHour = parseInt(adjustedStartTime.split(':')[0], 10);
        const adjustedStartMinute = parseInt(adjustedStartTime.split(':')[1], 10);
        
        const adjustedEndMinutes = adjustedStartHour * 60 + adjustedStartMinute + durationMinutes;
        const adjustedEndHour = Math.floor(adjustedEndMinutes / 60);
        const adjustedEndMinute = adjustedEndMinutes % 60;
        
        const adjustedEndTime = 
          `${adjustedEndHour.toString().padStart(2, '0')}:${adjustedEndMinute.toString().padStart(2, '0')}`;
        
        newScheduledRanges.push({
          id: `${targetDayStr}-${Date.now()}-${range.id}`,
          date: targetDayStr,
          startTime: adjustedStartTime,
          endTime: adjustedEndTime,
          templateId: selectedTemplate?.name
        });
      });
    } else {
      // Copy just the dragged time range
      console.log("Copying single time range:", draggedTimeRange);
      
      // Adjust the time to match the target slot's hour
      const adjustedStartTime = adjustTimeToTargetSlot(draggedTimeRange.startTime, time);
      
      // Calculate the duration of the original time range
      const startHour = parseInt(draggedTimeRange.startTime.split(':')[0], 10);
      const startMinute = parseInt(draggedTimeRange.startTime.split(':')[1], 10);
      const endHour = parseInt(draggedTimeRange.endTime.split(':')[0], 10);
      const endMinute = parseInt(draggedTimeRange.endTime.split(':')[1], 10);
      
      const durationMinutes = 
        (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
      
      // Calculate the adjusted end time
      const adjustedStartHour = parseInt(adjustedStartTime.split(':')[0], 10);
      const adjustedStartMinute = parseInt(adjustedStartTime.split(':')[1], 10);
      
      const adjustedEndMinutes = adjustedStartHour * 60 + adjustedStartMinute + durationMinutes;
      const adjustedEndHour = Math.floor(adjustedEndMinutes / 60);
      const adjustedEndMinute = adjustedEndMinutes % 60;
      
      const adjustedEndTime = 
        `${adjustedEndHour.toString().padStart(2, '0')}:${adjustedEndMinute.toString().padStart(2, '0')}`;
      
      newScheduledRanges.push({
        id: `${targetDayStr}-${Date.now()}-${draggedTimeRange.id}`,
        date: targetDayStr,
        startTime: adjustedStartTime,
        endTime: adjustedEndTime,
        templateId: selectedTemplate?.name
      });
    }
    
    // Add the new scheduled ranges
    setScheduledTimeRanges([...scheduledTimeRanges, ...newScheduledRanges]);
    
    // Reset drag state
    setDraggedTimeRange(null);
    setSourceDay(null);
    
    // Show a success message
    alert(`Successfully copied ${newScheduledRanges.length} time range(s) to ${targetDayStr}`);
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
        <div className="flex space-x-2">
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
          <Link
            href="/provider/templates"
            className="px-4 py-1.5 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors flex items-center"
          >
            <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
            Manage Templates
          </Link>
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

      {/* Template Selection Bar (shown when in template mode) */}
      {isTemplateMode && (
        <motion.div 
          variants={itemVariants} 
          className="bg-blue-50 p-4 rounded-xl shadow-sm flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
        >
          <div className="flex-shrink-0">
            <span className="font-medium text-blue-700">Apply template:</span>
          </div>
          <div className="flex-grow">
            <select
              value={selectedTemplate?.name || ""}
              onChange={(e) => {
                const template = templates.find(t => t.name === e.target.value);
                setSelectedTemplate(template || null);
              }}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 w-full sm:w-auto"
            >
              <option value="">Select a template</option>
              {templates.map((template) => (
                <option key={template.name} value={template.name}>
                  {template.name} ({template.timeRanges.length} time slots)
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center ml-2">
            <input
              type="checkbox"
              id="multiSelectMode"
              checked={isMultiSelectMode}
              onChange={() => setIsMultiSelectMode(!isMultiSelectMode)}
              className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="multiSelectMode" className="ml-2 text-sm text-blue-700">
              Multi-select mode
            </label>
          </div>
          <div className="flex-shrink-0 ml-auto">
            <button
              onClick={applyTemplateToSelectedDays}
              disabled={!selectedTemplate || selectedDays.length === 0}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                selectedTemplate && selectedDays.length > 0
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Apply to {selectedDays.length} selected day(s)
            </button>
          </div>
        </motion.div>
      )}

      <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="py-3 px-4 text-center font-medium bg-gray-50 text-gray-500 border-r"></div>
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className={`py-3 px-2 text-center font-medium ${
                isToday(day) ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-700'
              } ${index < 6 ? 'border-r' : ''} ${
                isTemplateMode && selectedDays.some(d => formatDate(d) === formatDate(day))
                  ? 'ring-2 ring-blue-500 ring-inset'
                  : ''
              } ${isTemplateMode ? 'cursor-pointer' : ''}`}
              onClick={() => isTemplateMode && toggleDaySelection(day)}
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
                const scheduledRanges = getScheduledTimeRangesForSlot(day, time);
                return (
                  <div 
                    key={dayIndex} 
                    className={`py-2 px-2 border-r min-h-[80px] ${
                      isToday(day) ? 'bg-blue-50/30' : ''
                    } ${dayIndex === 6 ? 'border-r-0' : ''}`}
                    onDragOver={(e) => handleDragOver(e, day, time)}
                    onDrop={(e) => handleDrop(e, day, time)}
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
                    
                    {/* Render scheduled time ranges */}
                    {scheduledRanges.map((range) => (
                      <div 
                        key={range.id} 
                        className="bg-green-100 border-l-4 border-green-600 p-2 text-xs rounded-md shadow-sm mb-1 hover:shadow-md transition-shadow"
                      >
                        <div className="font-medium text-green-800 mb-1">
                          {range.templateId ? `Template: ${range.templateId}` : 'Custom Time Range'}
                        </div>
                        <div className="flex items-center text-green-700">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          <span>{formatTime(range.startTime)} - {formatTime(range.endTime)}</span>
                        </div>
                        <button 
                          onClick={() => {
                            setScheduledTimeRanges(scheduledTimeRanges.filter(r => r.id !== range.id));
                          }}
                          className="mt-1 text-xs text-red-600 hover:text-red-800 flex items-center"
                        >
                          <TrashIcon className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                      </div>
                    ))}
                    
                    {/* Render template time ranges if in template mode and day is selected */}
                    {isTemplateMode && selectedTemplate && selectedDays.some(d => formatDate(d) === formatDate(day)) && (
                      selectedTemplate.timeRanges
                        .filter(range => range.startTime.startsWith(time.split(':')[0]))
                        .map(range => {
                          const isSelected = selectedTimeRanges.some(r => r.id === range.id);
                          return (
                            <div 
                              key={range.id}
                              className={`p-2 text-xs rounded-md shadow-sm mb-1 hover:shadow-md transition-shadow cursor-move border-l-4 ${
                                isSelected 
                                  ? 'bg-blue-200 border-blue-700' 
                                  : 'bg-blue-100 border-blue-600'
                              }`}
                              draggable
                              onDragStart={() => handleDragStart(range, day)}
                              onClick={() => toggleTimeRangeSelection(range)}
                              ref={dragTimeRangeRef}
                            >
                              <div className="font-medium text-blue-800 mb-1">Template: {selectedTemplate.name}</div>
                              <div className="flex items-center text-blue-700">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                <span>{formatTime(range.startTime)} - {formatTime(range.endTime)}</span>
                              </div>
                            </div>
                          );
                        })
                    )}
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

      {/* Template Mode Toggle Button */}
      <motion.div 
        variants={itemVariants}
        className="fixed bottom-6 right-6"
      >
        <button
          onClick={() => setIsTemplateMode(!isTemplateMode)}
          className={`p-3 rounded-full shadow-lg flex items-center justify-center ${
            isTemplateMode 
              ? "bg-red-600 text-white hover:bg-red-700" 
              : "bg-blue-600 text-white hover:bg-blue-700"
          } transition-colors`}
          title={isTemplateMode ? "Exit Template Mode" : "Enter Template Mode"}
        >
          <DocumentDuplicateIcon className="h-6 w-6" />
        </button>
      </motion.div>
    </motion.div>
  );
} 