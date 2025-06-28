"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// Mock event data (same as in events page)
const MOCK_EVENTS = [
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
    availableSlots: [
      { id: "1-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "1-2", date: "2023-06-15", time: "10:00 AM" },
      { id: "1-3", date: "2023-06-15", time: "11:00 AM" },
      { id: "1-4", date: "2023-06-16", time: "09:00 AM" },
      { id: "1-5", date: "2023-06-16", time: "10:00 AM" },
      { id: "1-6", date: "2023-06-17", time: "14:00 PM" },
      { id: "1-7", date: "2023-06-17", time: "15:00 PM" },
    ]
  },
  {
    id: "2",
    title: "Haircut & Styling",
    provider: "Style Studio",
    category: "Beauty",
    description: "Professional haircut and styling services.",
    longDescription: "Our professional stylists provide personalized haircuts and styling services tailored to your preferences and hair type. Whether you're looking for a simple trim or a complete transformation, our team uses premium products and techniques to ensure you leave looking and feeling your best.",
    duration: 45,
    price: 50,
    image: "https://placehold.co/600x400?text=Haircut",
    location: "456 Beauty Avenue, Style District",
    availableSlots: [
      { id: "2-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "2-2", date: "2023-06-15", time: "10:00 AM" },
      { id: "2-3", date: "2023-06-16", time: "14:00 PM" },
      { id: "2-4", date: "2023-06-16", time: "15:00 PM" },
    ]
  },
  {
    id: "3",
    title: "Yoga Class",
    provider: "Zen Yoga Center",
    category: "Fitness",
    description: "Beginner-friendly yoga class for relaxation and flexibility.",
    longDescription: "Our beginner-friendly yoga classes focus on fundamental poses, proper alignment, and breathing techniques. These sessions are designed to improve flexibility, reduce stress, and promote overall well-being. Our experienced instructors create a supportive environment suitable for practitioners of all levels.",
    duration: 60,
    price: 25,
    image: "https://placehold.co/600x400?text=Yoga+Class",
    location: "789 Zen Street, Wellness Center",
    availableSlots: [
      { id: "3-1", date: "2023-06-15", time: "16:00 PM" },
      { id: "3-2", date: "2023-06-15", time: "18:00 PM" },
      { id: "3-3", date: "2023-06-16", time: "16:00 PM" },
      { id: "3-4", date: "2023-06-16", time: "18:00 PM" },
      { id: "3-5", date: "2023-06-17", time: "10:00 AM" },
      { id: "3-6", date: "2023-06-17", time: "16:00 PM" },
    ]
  },
  {
    id: "4",
    title: "Car Maintenance",
    provider: "Quick Auto Service",
    category: "Automotive",
    description: "Basic car maintenance including oil change and inspection.",
    longDescription: "Our comprehensive car maintenance service includes oil change, filter replacement, fluid level checks, tire pressure adjustment, and a thorough inspection of key components. Our certified technicians use quality parts and fluids to keep your vehicle running smoothly and extend its lifespan.",
    duration: 60,
    price: 120,
    image: "https://placehold.co/600x400?text=Car+Maintenance",
    location: "101 Auto Road, Service Center",
    availableSlots: [
      { id: "4-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "4-2", date: "2023-06-15", time: "11:00 AM" },
      { id: "4-3", date: "2023-06-16", time: "09:00 AM" },
      { id: "4-4", date: "2023-06-16", time: "11:00 AM" },
    ]
  },
  {
    id: "5",
    title: "House Cleaning",
    provider: "CleanHome Services",
    category: "Home Services",
    description: "Professional house cleaning service for all room types.",
    longDescription: "Our professional house cleaning service covers all room types, including dusting, vacuuming, mopping, bathroom sanitization, kitchen cleaning, and more. Our trained cleaning staff uses eco-friendly products and efficient techniques to leave your home spotless and refreshed.",
    duration: 120,
    price: 100,
    image: "https://placehold.co/600x400?text=House+Cleaning",
    location: "Service provided at client's home",
    availableSlots: [
      { id: "5-1", date: "2023-06-15", time: "09:00 AM" },
      { id: "5-2", date: "2023-06-15", time: "13:00 PM" },
      { id: "5-3", date: "2023-06-16", time: "09:00 AM" },
      { id: "5-4", date: "2023-06-16", time: "13:00 PM" },
      { id: "5-5", date: "2023-06-17", time: "09:00 AM" },
    ]
  },
  {
    id: "6",
    title: "Financial Consultation",
    provider: "Money Matters Advisors",
    category: "Professional Services",
    description: "Personal financial planning and investment advice.",
    longDescription: "Our financial consultation service provides personalized financial planning, investment strategies, retirement planning, tax optimization, and debt management advice. Our certified financial advisors analyze your current financial situation and goals to create a tailored plan for your financial success.",
    duration: 60,
    price: 150,
    image: "https://placehold.co/600x400?text=Financial+Consultation",
    location: "202 Business Plaza, Financial District",
    availableSlots: [
      { id: "6-1", date: "2023-06-15", time: "10:00 AM" },
      { id: "6-2", date: "2023-06-15", time: "14:00 PM" },
      { id: "6-3", date: "2023-06-16", time: "10:00 AM" },
      { id: "6-4", date: "2023-06-16", time: "14:00 PM" },
      { id: "6-5", date: "2023-06-17", time: "10:00 AM" },
    ]
  }
];

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const router = useRouter();
  
  useEffect(() => {
    // In a real app, this would be an API call
    // Simulating API fetch with timeout
    setTimeout(() => {
      const foundEvent = MOCK_EVENTS.find(e => e.id === params.id);
      setEvent(foundEvent || null);
      setLoading(false);
    }, 500);
  }, [params.id]);
  
  // Group slots by date for better display
  const groupedSlots = event?.availableSlots.reduce((acc: any, slot: any) => {
    if (!acc[slot.date]) {
      acc[slot.date] = [];
    }
    acc[slot.date].push(slot);
    return acc;
  }, {});
  
  const handleBookNow = () => {
    if (!selectedSlot) {
      alert("Please select a time slot");
      return;
    }
    
    // In a real app, this would save the selection to state/context
    // and then redirect to the payment page
    router.push(`/user/checkout?eventId=${event.id}&slotId=${selectedSlot}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading event details...</p>
      </div>
    );
  }
  
  if (!event) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist or has been removed.</p>
        <Link href="/user/events" className="text-blue-600 hover:underline">
          Browse other events
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/user/events" className="flex items-center text-blue-600 mb-4 hover:underline">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Events
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 overflow-hidden">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{event.title}</h1>
              <p className="text-gray-600 mb-4">Provided by {event.provider}</p>
            </div>
            <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm">
              {event.category}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-3">About this service</h2>
              <p className="text-gray-700 mb-4">{event.longDescription}</p>
              
              <div className="flex flex-col sm:flex-row gap-6 mt-6">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{event.duration} minutes</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.location}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-center mb-4">
                <span className="text-2xl font-bold">${event.price}</span>
              </div>
              <button
                onClick={handleBookNow}
                disabled={!selectedSlot}
                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                  selectedSlot ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Book Now
              </button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Available Time Slots</h2>
            {Object.keys(groupedSlots || {}).length > 0 ? (
              <div className="space-y-4">
                {Object.entries(groupedSlots).map(([date, slots]: [string, any]) => (
                  <div key={date} className="border-b pb-4">
                    <h3 className="font-medium mb-2">{new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
                    <div className="flex flex-wrap gap-2">
                      {slots.map((slot: any) => (
                        <button
                          key={slot.id}
                          className={`py-2 px-4 border rounded-md ${
                            selectedSlot === slot.id
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white hover:bg-gray-50'
                          }`}
                          onClick={() => setSelectedSlot(slot.id)}
                        >
                          {slot.time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No available time slots.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 