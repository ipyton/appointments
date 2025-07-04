"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, MapPin, MessageCircle, X } from "lucide-react";

// Define TypeScript interfaces
interface Slot {
  id: string;
  date: string;
  time: string;
}

interface Event {
  id: string;
  title: string;
  provider: string;
  category: string;
  description: string;
  longDescription: string;
  duration: number;
  price: number;
  image: string;
  location: string;
  allowMultipleBookings: boolean;
  availableSlots: Slot[];
}

interface ChatMessage {
  id: number;
  sender: string;
  text: string;
  timestamp: Date;
}

// Mock event data with allowMultipleBookings attribute
const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Dental Checkup",
    provider: "Dr. Smith",
    category: "Healthcare",
    description: "Regular dental checkup and cleaning.",
    longDescription: "Our dental checkup includes a comprehensive examination of your teeth and gums, professional cleaning to remove plaque and tartar, and recommendations for maintaining optimal oral health. Our experienced dentists use modern equipment to ensure your comfort throughout the procedure.",
    duration: 30,
    price: 75,
    image: "https://placehold.co/600x400?text=Dental+Checkup",
    location: "123 Health Street, Medical Center",
    allowMultipleBookings: false, // Single choice
    availableSlots: [
      { id: "1-1", date: "2025-07-15", time: "09:00 AM" },
      { id: "1-2", date: "2025-07-15", time: "10:00 AM" },
      { id: "1-3", date: "2025-07-15", time: "11:00 AM" },
      { id: "1-4", date: "2025-07-16", time: "09:00 AM" },
      { id: "1-5", date: "2025-07-16", time: "10:00 AM" },
      { id: "1-6", date: "2025-07-17", time: "14:00 PM" },
      { id: "1-7", date: "2025-07-17", time: "15:00 PM" },
      { id: "1-8", date: "2025-07-18", time: "09:00 AM" },
      { id: "1-9", date: "2025-07-20", time: "10:00 AM" },
    ]
  },
  {
    id: "2",
    title: "Fitness Training Package",
    provider: "FitLife Gym",
    category: "Fitness",
    description: "Personal training sessions package.",
    longDescription: "Our comprehensive fitness training package allows you to book multiple sessions with our certified personal trainers. Design your own schedule and work towards your fitness goals with flexible booking options.",
    duration: 60,
    price: 80,
    image: "https://placehold.co/600x400?text=Fitness+Training",
    location: "456 Fitness Street, Gym Center",
    allowMultipleBookings: true, // Multiple choice
    availableSlots: [
      { id: "2-1", date: "2025-07-15", time: "09:00 AM" },
      { id: "2-2", date: "2025-07-15", time: "10:00 AM" },
      { id: "2-3", date: "2025-07-16", time: "14:00 PM" },
      { id: "2-4", date: "2025-07-16", time: "15:00 PM" },
      { id: "2-5", date: "2025-07-17", time: "16:00 PM" },
      { id: "2-6", date: "2025-07-18", time: "09:00 AM" },
      { id: "2-7", date: "2025-07-20", time: "10:00 AM" },
    ]
  }
];

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event>(MOCK_EVENTS[0]); // Default to first event for demo
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: 'consultant', text: `Hello! I'm here to help you with your ${event.title.toLowerCase()} booking. How can I assist you today?`, timestamp: new Date() }
  ]);
  const [newMessage, setNewMessage] = useState<string>('');

  // Get available dates for the event
  const availableDates = [...new Set(event.availableSlots.map(slot => slot.date))];

  // Get slots for selected date
  const getSlotsForDate = (date: string) => {
    if (!date) return [];
    return event.availableSlots.filter(slot => slot.date === date);
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
    return availableDates.includes(dateStr);
  };

  const handleDateSelect = (dateStr: string) => {
    setSelectedDate(dateStr);
    setSelectedSlots([]); // Reset selected slots when date changes
  };

  const handleSlotSelect = (slotId: string) => {
    if (event.allowMultipleBookings) {
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

  const handleBookNow = () => {
    if (selectedSlots.length === 0) {
      alert("Please select at least one time slot");
      return;
    }
    
    const selectedSlotDetails = event.availableSlots.filter(slot => 
      selectedSlots.includes(slot.id)
    );
    
    alert(`Booking confirmed for:\n${selectedSlotDetails.map(slot => 
      `${slot.date} at ${slot.time}`
    ).join('\n')}`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Simulate consultant response
    setTimeout(() => {
      const responses = [
        "Thank you for your message! I'll help you with that right away.",
        "That's a great question! Let me provide you with more information.",
        "I understand your concern. Here's what I recommend...",
        "Perfect! I can definitely help you with your booking.",
      ];
      
      const consultantResponse = {
        id: chatMessages.length + 2,
        sender: 'consultant',
        text: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, consultantResponse]);
    }, 1000);
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

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">Provided by {event.provider}</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">
                {event.category}
              </span>
              <button
                onClick={() => setIsChatOpen(true)}
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
              <p className="text-gray-700 mb-4">{event.longDescription}</p>
              
              <div className="flex flex-col gap-4 mt-6">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{event.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                  <span>{event.location}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${event.price} {event.allowMultipleBookings && "per session"}
                </div>
                {event.allowMultipleBookings && (
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
                  <div className="grid grid-cols-2 gap-2">
                    {getSlotsForDate(selectedDate).map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotSelect(slot.id)}
                        className={`py-2 px-4 border rounded-lg text-sm transition-colors ${
                          selectedSlots.includes(slot.id)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white hover:bg-gray-50 border-gray-200'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Book Now Button */}
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
      
      {/* Chat Modal */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold">Chat with Consultant</h3>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}