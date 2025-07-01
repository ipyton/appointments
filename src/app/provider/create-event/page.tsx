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
  CheckCircleIcon,
  PhotoIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

interface TimeTemplate {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
}

interface RepeatConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // every X days/weeks/months
  endDate: string;
  endAfter: number; // end after X occurrences
  endType: 'date' | 'occurrences' | 'never';
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  // Enhanced date/time management
  const [startDate, setStartDate] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [customTimeSlots, setCustomTimeSlots] = useState<TimeSlot[]>([
    { startTime: "", endTime: "" }
  ]);
  
  // Repeat configuration
  const [repeatConfig, setRepeatConfig] = useState<RepeatConfig>({
    enabled: false,
    frequency: 'weekly',
    interval: 1,
    endDate: '',
    endAfter: 10,
    endType: 'occurrences'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Predefined time templates
  const timeTemplates: TimeTemplate[] = [
    {
      id: 'morning',
      name: 'Morning Sessions',
      timeSlots: [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:30', endTime: '11:30' },
        { startTime: '12:00', endTime: '13:00' }
      ]
    },
    {
      id: 'afternoon',
      name: 'Afternoon Sessions',
      timeSlots: [
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:30', endTime: '16:30' },
        { startTime: '17:00', endTime: '18:00' }
      ]
    },
    {
      id: 'evening',
      name: 'Evening Sessions',
      timeSlots: [
        { startTime: '18:00', endTime: '19:00' },
        { startTime: '19:30', endTime: '20:30' },
        { startTime: '21:00', endTime: '22:00' }
      ]
    },
    {
      id: 'full_day',
      name: 'Full Day Schedule',
      timeSlots: [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:30', endTime: '11:30' },
        { startTime: '13:00', endTime: '14:00' },
        { startTime: '14:30', endTime: '15:30' },
        { startTime: '16:00', endTime: '17:00' },
        { startTime: '17:30', endTime: '18:30' }
      ]
    }
  ];

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    if (templateId === 'custom') {
      setCustomTimeSlots([{ startTime: "", endTime: "" }]);
    } else {
      const template = timeTemplates.find(t => t.id === templateId);
      if (template) {
        setCustomTimeSlots(template.timeSlots);
      }
    }
  };

  // Handle custom time slot changes
  const addCustomTimeSlot = () => {
    setCustomTimeSlots([...customTimeSlots, { startTime: "", endTime: "" }]);
  };

  const removeCustomTimeSlot = (index: number) => {
    const newSlots = [...customTimeSlots];
    newSlots.splice(index, 1);
    setCustomTimeSlots(newSlots);
  };

  const handleCustomTimeSlotChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newSlots = [...customTimeSlots];
    newSlots[index][field] = value;
    setCustomTimeSlots(newSlots);
  };

  // Generate dates based on repeat configuration
  const generateRepeatedDates = (startDate: string, repeatConfig: RepeatConfig): string[] => {
    if (!repeatConfig.enabled) return [startDate];
    
    const dates: string[] = [];
    const start = new Date(startDate);
    let current = new Date(start);
    
    // Determine end condition
    let maxOccurrences = 100; // Safety limit
    if (repeatConfig.endType === 'occurrences') {
      maxOccurrences = repeatConfig.endAfter;
    } else if (repeatConfig.endType === 'date' && repeatConfig.endDate) {
      const endDate = new Date(repeatConfig.endDate);
      maxOccurrences = Math.ceil((endDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)) + 10; // Rough estimate
    }
    
    for (let i = 0; i < maxOccurrences; i++) {
      dates.push(current.toISOString().split('T')[0]);
      
      // Check end date condition
      if (repeatConfig.endType === 'date' && repeatConfig.endDate) {
        if (current >= new Date(repeatConfig.endDate)) break;
      }
      
      // Increment based on frequency
      switch (repeatConfig.frequency) {
        case 'daily':
          current.setDate(current.getDate() + repeatConfig.interval);
          break;
        case 'weekly':
          current.setDate(current.getDate() + (7 * repeatConfig.interval));
          break;
        case 'monthly':
          current.setMonth(current.getMonth() + repeatConfig.interval);
          break;
      }
    }
    
    return dates;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form
    if (!title || !description || !duration || !price || !startDate) {
      alert("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    // Check if time slots are filled
    const hasValidTimeSlots = customTimeSlots.every(slot => 
      slot.startTime && slot.endTime
    );

    if (!hasValidTimeSlots) {
      alert("Please fill in all time slots");
      setIsSubmitting(false);
      return;
    }

    try {
      // Generate all event dates
      const eventDates = generateRepeatedDates(startDate, repeatConfig);
      
      // Create date slots for each generated date
      const generatedDateSlots = eventDates.map(date => ({
        date,
        timeSlots: [...customTimeSlots]
      }));

      const eventData = {
        title,
        description,
        duration,
        price: parseFloat(price),
        dateSlots: generatedDateSlots,
        providerId: user?.id,
        isActive: true,
        createdAt: new Date().toISOString(),
        image: eventImage,
        repeatConfig: repeatConfig.enabled ? repeatConfig : null,
        template: selectedTemplate !== 'custom' ? selectedTemplate : null
      };
      
      console.log("Event Data:", eventData);
      
      // In a real app, you would upload the image and send data to your backend
      // const formData = new FormData();
      // formData.append('eventData', JSON.stringify(eventData));
      // if (eventImage) formData.append('image', eventImage);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
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
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold mb-8 text-gray-900 border-b pb-4">Create New Event</motion.h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Details Section */}
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

        {/* Image Upload Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-4">
            <PhotoIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Event Image</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Event preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                      <span className="text-white text-sm font-medium">Click to change image</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
                  </div>
                )}
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
            
            {eventImage && (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-800">{eventImage.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEventImage(null);
                    setImagePreview("");
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Schedule Setup Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-5">
            <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Schedule Setup</h2>
          </div>
          
          {/* Start Date */}
          <div className="mb-5">
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
              required
            />
          </div>

          {/* Time Template Selection */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Time Template *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {timeTemplates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleTemplateChange(template.id)}
                  className={`p-4 text-left border rounded-lg transition-colors shadow-sm hover:shadow-md ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm">{template.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {template.timeSlots.length} time slots
                  </div>
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleTemplateChange('custom')}
                className={`p-4 text-left border rounded-lg transition-colors shadow-sm hover:shadow-md ${
                  selectedTemplate === 'custom'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">Custom</div>
                <div className="text-xs text-gray-500 mt-1">
                  Create your own schedule
                </div>
              </button>
            </div>
          </div>

          {/* Custom Time Slots */}
                          {selectedTemplate && (
            <div className="mb-5">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-gray-700 flex items-center">
                  <ClockIcon className="h-4 w-4 text-gray-600 mr-1" />
                  Time Slots
                </h4>
                {selectedTemplate === 'custom' && (
                  <button
                    type="button"
                    onClick={addCustomTimeSlot}
                    className="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium shadow-sm"
                  >
                    <PlusIcon className="h-3.5 w-3.5 mr-1" />
                    Add Time Slot
                  </button>
                )}
              </div>
              
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                {customTimeSlots.map((timeSlot, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Start Time *
                      </label>
                      <input
                        type="time"
                        value={timeSlot.startTime}
                        onChange={(e) => handleCustomTimeSlotChange(index, 'startTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        required
                        disabled={selectedTemplate !== 'custom'}
                      />
                    </div>
                    
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        End Time *
                      </label>
                      <input
                        type="time"
                        value={timeSlot.endTime}
                        onChange={(e) => handleCustomTimeSlotChange(index, 'endTime', e.target.value)}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors"
                        required
                        disabled={selectedTemplate !== 'custom'}
                      />
                    </div>
                    
                    {selectedTemplate === 'custom' && customTimeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomTimeSlot(index)}
                        className="mt-6 text-red-600 hover:text-red-800 p-1 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Repeat Settings Section */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center mb-5">
            <ArrowPathIcon className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Repeat Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                id="enableRepeat"
                checked={repeatConfig.enabled}
                onChange={(e) => setRepeatConfig({...repeatConfig, enabled: e.target.checked})}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="enableRepeat" className="ml-2 text-sm font-medium text-gray-800">
                Repeat this event
              </label>
            </div>
            
            {repeatConfig.enabled && (
              <div className="space-y-4 pl-6 border-l-2 border-blue-200 bg-blue-50 p-4 rounded-lg">
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Repeat Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setRepeatConfig({...repeatConfig, frequency: 'daily'})}
                      className={`px-3 py-2 text-center border rounded-md transition-colors ${
                        repeatConfig.frequency === 'daily'
                          ? 'border-blue-500 bg-blue-100 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-sm font-medium">Daily</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepeatConfig({...repeatConfig, frequency: 'weekly'})}
                      className={`px-3 py-2 text-center border rounded-md transition-colors ${
                        repeatConfig.frequency === 'weekly'
                          ? 'border-blue-500 bg-blue-100 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-sm font-medium">Weekly</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRepeatConfig({...repeatConfig, frequency: 'monthly'})}
                      className={`px-3 py-2 text-center border rounded-md transition-colors ${
                        repeatConfig.frequency === 'monthly'
                          ? 'border-blue-500 bg-blue-100 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-sm font-medium">Monthly</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    End repeat
                  </label>
                  <div className="space-y-3 bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <input
                        type="radio"
                        id="endNever"
                        name="endType"
                        value="never"
                        checked={repeatConfig.endType === 'never'}
                        onChange={(e) => setRepeatConfig({...repeatConfig, endType: 'never'})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="endNever" className="ml-2 text-sm text-gray-700 font-medium">
                        Never
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <input
                        type="radio"
                        id="endAfter"
                        name="endType"
                        value="occurrences"
                        checked={repeatConfig.endType === 'occurrences'}
                        onChange={(e) => setRepeatConfig({...repeatConfig, endType: 'occurrences'})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="endAfter" className="text-sm text-gray-700 font-medium">
                        After
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={repeatConfig.endAfter}
                        onChange={(e) => setRepeatConfig({...repeatConfig, endAfter: parseInt(e.target.value)})}
                        disabled={repeatConfig.endType !== 'occurrences'}
                        className="w-20 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:bg-gray-100"
                      />
                      <span className="text-sm text-gray-700">occurrences</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md transition-colors">
                      <input
                        type="radio"
                        id="endOn"
                        name="endType"
                        value="date"
                        checked={repeatConfig.endType === 'date'}
                        onChange={(e) => setRepeatConfig({...repeatConfig, endType: 'date'})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="endOn" className="text-sm text-gray-700 font-medium">
                        On
                      </label>
                      <input
                        type="date"
                        value={repeatConfig.endDate}
                        onChange={(e) => setRepeatConfig({...repeatConfig, endDate: e.target.value})}
                        disabled={repeatConfig.endType !== 'date'}
                        min={startDate}
                        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 transition-colors disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Submit Buttons */}
        <motion.div variants={itemVariants} className="flex justify-end space-x-4 pt-4 mt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center shadow-sm ${
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
                <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                Create Event
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}