"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  DocumentTextIcon,
  PlusIcon,
  TrashIcon,
  CheckCircleIcon
} from "@heroicons/react/24/outline";

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!title || !description || !duration || !price) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
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
      setIsSubmitting(false);
      return;
    }

    try {
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Redirect to events page
      router.push("/provider/events");
    } catch (error) {
      console.error("Error creating event:", error);
      setIsSubmitting(false);
    }
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

  return (
    <motion.div 
      className="max-w-3xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 variants={itemVariants} className="text-2xl font-bold mb-6 text-gray-900">Create New Event</motion.h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6 space-y-5">
          <div className="flex items-center mb-2">
            <DocumentTextIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Event Details</h2>
          </div>
          
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              placeholder="e.g. Hair Cut, Massage Therapy"
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
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              placeholder="Describe your service in detail"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                Duration *
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(parseInt(e.target.value))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-500 mr-1" />
                Price *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-7 transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Available Dates and Times</h2>
            </div>
            <button
              type="button"
              onClick={addDate}
              className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Date
            </button>
          </div>
          
          {dateSlots.map((dateSlot, dateIndex) => (
            <motion.div 
              key={dateIndex} 
              className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900 flex items-center">
                  <CalendarIcon className="h-4 w-4 text-gray-600 mr-1" />
                  Date {dateIndex + 1}
                </h3>
                {dateSlots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeDate(dateIndex)}
                    className="inline-flex items-center text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove
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
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-700 flex items-center">
                    <ClockIcon className="h-4 w-4 text-gray-600 mr-1" />
                    Time Slots
                  </h4>
                  <button
                    type="button"
                    onClick={() => addTimeSlot(dateIndex)}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-xs font-medium"
                  >
                    <PlusIcon className="h-3 w-3 mr-1" />
                    Add Time Slot
                  </button>
                </div>
                
                {dateSlot.timeSlots.map((timeSlot, timeIndex) => (
                  <div key={timeIndex} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={timeSlot.startTime}
                        onChange={(e) => handleTimeSlotChange(dateIndex, timeIndex, 'startTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
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
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        required
                      />
                    </div>
                    
                    {dateSlot.timeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(dateIndex, timeIndex)}
                        className="mt-6 text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
          
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={addDate}
              className="inline-flex items-center px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              Add Another Date
            </button>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center ${
              isSubmitting ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                Create Event
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
} 