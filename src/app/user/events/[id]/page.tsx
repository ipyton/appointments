"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, MessageCircle, Users, Check, Star } from "lucide-react";
import Service from "@/apis/Service";
import Appointment from "@/apis/Appointment";
import Event from "@/apis/Event";
import { useRouter, useParams } from "next/navigation";

// Define TypeScript interfaces
interface Slot {
  id: string;
  date: string;
  time: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  maxConcurrentAppointments: number;
  currentAppointmentCount: number;
}

interface ServiceData {
  id: number;
  name: string;
  enabled: boolean;
  description: string;
  price: number;
  providerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  allowMultipleBookings: boolean;
  arrangements: any | null;
}

interface ProviderData {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
  phoneNumber: string | null;
}

interface EventData {
  service: ServiceData;
  provider: ProviderData;
}

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;
  
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [availableSlots, setAvailableSlots] = useState<Slot[]>([]);
  const [availableDays, setAvailableDays] = useState<Record<number, number>>({});
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [isStarred, setIsStarred] = useState<boolean>(false);
  const [starLoading, setStarLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await Service.getEventById(eventId);
        const data = await response.json();
        console.log("Event:", data);
        setEventData(data);
        
        // Fetch slots by month to show available days on calendar
        try {
          // Add 1 to month value since backend expects 1-12 range, not JavaScript's 0-11 range
          const slotsResponse = await Service.getSlotsByMonth(new Date().getFullYear(), new Date().getMonth() + 1, eventId);
          const slotsData = await slotsResponse.json();
          console.log("Slots by month:", slotsData);
          setAvailableDays(slotsData);
        } catch (error) {
          console.error("Error fetching slots:", error);
        }
        
        // Check if event is starred
        try {
          const starredResponse = await Event.checkIfServiceStarred(eventId);
          if (!starredResponse.ok) {
            throw new Error("Failed to check starred status");
          }
          const starredData = await starredResponse.json();
          setIsStarred(starredData.isStarred);
        } catch (error) {
          console.error("Error checking starred status:", error);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEventData();
  }, [eventId]);

  const handleToggleStar = async () => {
    if (starLoading) return;
    
    setStarLoading(true);
    try {
      const response = await Event.toggleStarService(eventId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update star status");
      }
      
      setIsStarred(!isStarred);
    } catch (error) {
      console.error("Error toggling star:", error);
    } finally {
      setStarLoading(false);
    }
  };

  // Show loading state while fetching event
  if (loading || !eventData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading event details...</div>
      </div>
    );
  }

  const { service, provider } = eventData;

  // Get available dates for the event
  const availableDates = [...new Set(availableSlots.map(slot => slot.date))];

  // Check if a specific day in the current month is available
  const isDayAvailable = (day: number) => {
    return availableDays[day] > 0;
  };

  // Calendar helper functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isDateAvailable = (dateStr: string) => {
    // For the current month, use the availableDays data
    const date = new Date(dateStr);
    if (date.getMonth() === currentMonth.getMonth() && 
        date.getFullYear() === currentMonth.getFullYear()) {
      return isDayAvailable(date.getDate());
    }
    // For other months, fall back to the previous implementation
    return availableDates.includes(dateStr);
  };

  const handleDateSelect = async (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlots([]); // Reset selected slots when date changes
    
    try {
      // Fetch slots for the selected date
      const slotsResponse = await Service.getSlotsByDate(dateStr, eventId);
      const slotsData = await slotsResponse.json();
      console.log("Slots for selected date:", slotsData);
      
      if (Array.isArray(slotsData)) {
        // Transform the API response to match our Slot interface
        const formattedSlots = slotsData.map(slot => {
          // Parse the start and end times
          const startTime = slot.startTime.includes('T') 
            ? new Date(slot.startTime) 
            : new Date(`${slot.date}T${slot.startTime}`);
            
          const endTime = slot.endTime.includes('T') 
            ? new Date(slot.endTime) 
            : new Date(`${slot.date}T${slot.endTime}`);
          
          // Format the times for display
          const formattedStartTime = startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedEndTime = endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          return {
            id: slot.id.toString(),
            date: dateStr,
            time: `${formattedStartTime} - ${formattedEndTime}`,
            isAvailable: slot.isAvailable,
            startTime: formattedStartTime,
            endTime: formattedEndTime,
            maxConcurrentAppointments: slot.maxConcurrentAppointments,
            currentAppointmentCount: slot.currentAppointmentCount
          };
        });
        
        // Filter out any unavailable slots
        const availableSlots = formattedSlots.filter(slot => slot.isAvailable);
        setAvailableSlots(availableSlots);
      } else {
        console.error("Unexpected slots data format:", slotsData);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("Error fetching slots for date:", error);
      setAvailableSlots([]);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    if (service.allowMultipleBookings) {
      // Multiple selection
      setSelectedSlots(prev => 
        prev.includes(slotId) 
          ? prev.filter(id => id !== slotId)
          : [...prev, slotId]
      );
    } else {
      // Single selection
      setSelectedSlots([slotId]);
    }
  };

  const handleBookNow = async () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one time slot");
      return;
    }
    
    if (!contactEmail) {
      alert("Please provide a contact email");
      return;
    }
    
    const selectedSlotDetails = availableSlots.filter(slot => 
      selectedSlots.includes(slot.id)
    );
    
    try {
      // Get the first selected slot
      const selectedSlot = selectedSlotDetails[0];
      const startTimeDate = new Date(`${selectedDate}T${selectedSlot.startTime}`);
      
      // Format as ISO string for the API
      const startTime = startTimeDate.toISOString();
      
      // Call the bookAppointment API with all required parameters
      const response = await Appointment.bookAppointment(
        service.id,
        startTime,
        null,  // templateId
        selectedSlot.id,  // slotId
        null,  // dayId
        null,  // segmentId
        bookingNotes || "",  // notes
        contactEmail,  // contactEmail
        contactPhone || ""  // contactPhone
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to book appointment");
      }
      
      const bookingData = await response.json();
      console.log("Booking successful:", bookingData);
      
      // Navigate to checkout page
      router.push(`/user/checkout?appointmentId=${bookingData.id}`);
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment. Please try again.");
    }
  };

  // Render calendar
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const isAvailable = isDateAvailable(dateStr);
      const isSelected = selectedDate === dateStr;
      const isToday = dateStr === new Date().toISOString().split('T')[0];
      
      days.push(
        <button
          key={day}
          onClick={() => isAvailable && handleDateSelect(dateStr)}
          className={`h-10 w-10 rounded-lg text-sm font-medium transition-colors ${
            isSelected
              ? 'bg-blue-600 text-white'
              : isAvailable
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'text-gray-300 cursor-not-allowed'
          } ${isToday && !isSelected ? 'ring-2 ring-blue-200' : ''}`}
          disabled={!isAvailable}
        >
          {day}
          {isAvailable && !isSelected && (
            <div className="w-1 h-1 bg-blue-600 rounded-full mx-auto mt-1"></div>
          )}
        </button>
      );
    }
    
    return days;
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Calculate duration from description (temporary solution)
  const durationMatch = service.description.match(/(\d+)-minute/);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 30;

  // Default image for service
  const defaultImage = "https://placebear.com/800/600";

  return (
    <div className="max-w-6xl mx-auto p-4">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ChevronLeft size={20} />
        <span>Back</span>
      </button>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img 
            src={defaultImage} 
            alt={service.name} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{service.name}</h1>
              <p className="text-gray-600 mb-4">Provided by {provider.businessName || provider.fullName}</p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleToggleStar}
                className={`p-2 rounded-full transition-colors ${
                  isStarred
                    ? "bg-yellow-100 text-yellow-500"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
                disabled={starLoading}
              >
                <Star
                  size={20}
                  fill={isStarred ? "currentColor" : "none"}
                  className={starLoading ? "animate-pulse" : ""}
                />
              </button>
              <button
                onClick={() => router.push(`/user/chat?providerId=${provider.id}`)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <MessageCircle size={16} />
                Chat with Consultant
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Event Details */}
            <div>
              <h2 className="text-xl font-semibold mb-3">About this service</h2>
              <p className="text-gray-700 mb-4">{service.description}</p>
              
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{duration} minutes</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${service.price} {service.allowMultipleBookings && "per session"}
                </div>
                {service.allowMultipleBookings && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">
                      ✓ You can select multiple time slots for this service
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Calendar and Booking */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Select Date & Time</h2>
              
              {/* Calendar */}
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="text-lg font-semibold">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h3>
                  <button
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                    className="p-2 hover:bg-gray-200 rounded-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map(day => (
                    <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {renderCalendar()}
                </div>
              </div>
              
              {/* Time Slots */}
              {selectedDate && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">
                    Available times for {new Date(selectedDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  {availableSlots.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                      {availableSlots.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotSelect(slot.id)}
                          className={`py-3 px-4 border rounded-lg text-sm transition-colors flex justify-between items-center ${
                            selectedSlots.includes(slot.id)
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white hover:bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span className="font-medium">{slot.time}</span>
                            <span className="text-xs mt-1 opacity-75">
                              {slot.maxConcurrentAppointments > 1 ? 
                                `${slot.maxConcurrentAppointments - slot.currentAppointmentCount} of ${slot.maxConcurrentAppointments} spots available` : 
                                '1 spot available'}
                            </span>
                          </div>
                          {selectedSlots.includes(slot.id) && (
                            <Check size={18} className="text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      No available time slots for this date.
                    </div>
                  )}
                </div>
              )}
              
              {/* Book Now Button */}
              <div className="space-y-4">
                <div className="mt-4">
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    maxLength={100}
                  />
                </div>
                
                <div className="mt-4">
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Phone (optional)
                  </label>
                  <input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    maxLength={20}
                  />
                </div>

                <div className="mt-4">
                  <label htmlFor="bookingNotes" className="block text-sm font-medium text-gray-700 mb-1">
                    Notes for your appointment (optional)
                  </label>
                  <textarea
                    id="bookingNotes"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    placeholder="Add any special requests or information for your appointment..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  />
                </div>
                
                <button
                  onClick={handleBookNow}
                  disabled={selectedSlots.length === 0}
                  className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                    selectedSlots.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {selectedSlots.length === 0 
                    ? 'Select a time slot to book' 
                    : `Book ${selectedSlots.length} ${selectedSlots.length === 1 ? 'slot' : 'slots'}`
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat Modal removed */}
    </div>
  );
}