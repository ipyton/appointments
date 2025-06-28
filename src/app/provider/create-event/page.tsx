"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState("");
  const [dateSlots, setDateSlots] = useState<DateSlot[]>([
    { date: "", timeSlots: [{ startTime: "", endTime: "" }] }
  ]);

  // Handle adding a new date
  const addDate = () => {
    setDateSlots([...dateSlots, { date: "", timeSlots: [{ startTime: "", endTime: "" }] }]);
  };

  // Handle removing a date
  const removeDate = (dateIndex: number) => {
    const newDateSlots = [...dateSlots];
    newDateSlots.splice(dateIndex, 1);
    setDateSlots(newDateSlots);
  };

  // Handle adding a time slot to a specific date
  const addTimeSlot = (dateIndex: number) => {
    const newDateSlots = [...dateSlots];
    newDateSlots[dateIndex].timeSlots.push({ startTime: "", endTime: "" });
    setDateSlots(newDateSlots);
  };

  // Handle removing a time slot from a specific date
  const removeTimeSlot = (dateIndex: number, timeIndex: number) => {
    const newDateSlots = [...dateSlots];
    newDateSlots[dateIndex].timeSlots.splice(timeIndex, 1);
    setDateSlots(newDateSlots);
  };

  // Handle date change
  const handleDateChange = (dateIndex: number, value: string) => {
    const newDateSlots = [...dateSlots];
    newDateSlots[dateIndex].date = value;
    setDateSlots(newDateSlots);
  };

  // Handle time slot change
  const handleTimeSlotChange = (dateIndex: number, timeIndex: number, field: 'startTime' | 'endTime', value: string) => {
    const newDateSlots = [...dateSlots];
    newDateSlots[dateIndex].timeSlots[timeIndex][field] = value;
    setDateSlots(newDateSlots);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!title || !description || !duration || !price) {
      alert("Please fill in all required fields");
      return;
    }

    // Check if all dates and time slots are filled
    const isValid = dateSlots.every(dateSlot => 
      dateSlot.date && dateSlot.timeSlots.every(timeSlot => 
        timeSlot.startTime && timeSlot.endTime
      )
    );

    if (!isValid) {
      alert("Please fill in all dates and time slots");
      return;
    }

    // In a real app, this would send data to your backend
    console.log({
      title,
      description,
      duration,
      price: parseFloat(price),
      dateSlots,
      providerId: user?.id,
      isActive: true,
      createdAt: new Date().toISOString()
    });

    // Redirect to events page
    router.push("/provider/events");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Event</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes) *
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
                <option value={90}>1.5 hours</option>
                <option value={120}>2 hours</option>
                <option value={180}>3 hours</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">Available Dates and Times</h2>
          
          {dateSlots.map((dateSlot, dateIndex) => (
            <div key={dateIndex} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Date {dateIndex + 1}</h3>
                {dateSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDate(dateIndex)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Date
                  </button>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date *
                </label>
                <input
                  type="date"
                  value={dateSlot.date}
                  onChange={(e) => handleDateChange(dateIndex, e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-sm font-medium">Time Slots</h4>
                
                {dateSlot.timeSlots.map((timeSlot, timeIndex) => (
                  <div key={timeIndex} className="flex items-center space-x-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={timeSlot.startTime}
                        onChange={(e) => handleTimeSlotChange(dateIndex, timeIndex, 'startTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={timeSlot.endTime}
                        onChange={(e) => handleTimeSlotChange(dateIndex, timeIndex, 'endTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    
                    {dateSlot.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                        className="mt-6 text-red-600 hover:text-red-800"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => addTimeSlot(dateIndex)}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Time Slot
                </button>
              </div>
            </div>
          ))}
          
          <button
            type="button"
            onClick={addDate}
            className="mt-4 text-blue-600 hover:text-blue-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add Another Date
          </button>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push("/provider/events")}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Create Event
          </button>
        </div>
      </form>
    </div>
  );
} 