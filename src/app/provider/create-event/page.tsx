"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { EventDetailsSection } from "@/components/events/EventDetailsSection";
import { ImageUploadSection } from "@/components/events/ImageUploadSection";
import { ScheduleSection } from "@/components/events/ScheduleSection";
import { RepeatSettingsSection } from "@/components/events/RepeatSettingsSection";
import { SubmitButtonsSection } from "@/components/events/SubmitButtonsSection";
import { EventSubmitter } from "@/components/events/EventSubmitter";
import { TimeSlot, TimeTemplate, SchedulePreview, RepeatConfig, DateSlot } from "@/components/events/types";
import Templates from "@/apis/Templates";
import { Template, TimeRange } from "@/types/templates";

// Extended Template interface for our component
interface ExtendedTemplate extends Omit<Template, 'daySchedules'> {
  timeSlots: TimeSlot[];
}

export default function CreateEventPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [price, setPrice] = useState("");
  const [eventImage, setEventImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  // Enhanced date/time management
  const [startDate, setStartDate] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [customTimeSlots, setCustomTimeSlots] = useState<TimeSlot[]>([
    { startTime: "", endTime: "" }
  ]);
  
  // Schedule preview
  const [showPreview, setShowPreview] = useState(false);
  const [schedulePreview, setSchedulePreview] = useState<SchedulePreview[]>([]);
  
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
  const [timeTemplates, setTimeTemplates] = useState<ExtendedTemplate[]>([]);
  const [validSchedules, setValidSchedules] = useState<any[]>([]);

  useEffect(() => {
    Templates.getTemplates().then(response => {
      if (response.ok) {
        response.json().then(data => {
          // Transform the template data to include timeSlots
          const extendedTemplates = data.map((template: Template) => {
            // Extract all time ranges from day schedules and flatten into timeSlots
            const timeSlots = template.daySchedules.flatMap(day => 
              day.timeRanges.map(range => ({
                startTime: range.startTime,
                endTime: range.endTime
              }))
            );
            
            return {
              ...template,
              timeSlots
            };
          });
          
          setTimeTemplates(extendedTemplates);
        });
      }
    });
  }, []);

  useEffect(() => {
    console.log("Valid schedules updated:", validSchedules);
  }, [validSchedules]);

  // Handle template selection
  const handleTemplateChange = (templateId: string) => {
    if (templateId === 'custom') {
      setSelectedTemplates(['custom']);
      setCustomTimeSlots([{ startTime: "", endTime: "" }]);
    } else {
      // If custom was previously selected, remove it
      if (selectedTemplates.includes('custom')) {
        setSelectedTemplates([templateId]);
      } else {
        // Toggle template selection
        if (selectedTemplates.includes(templateId)) {
          setSelectedTemplates(selectedTemplates.filter(id => id !== templateId));
        } else {
          setSelectedTemplates([...selectedTemplates, templateId]);
        }
      }
    }
    
    // Update preview after template selection changes
    if (startDate) {
      generateSchedulePreview(startDate, templateId);
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
    
    // Update preview after removing a time slot
    if (startDate && selectedTemplates.includes('custom')) {
      generateSchedulePreview(startDate, 'custom');
    }
  };

  const handleCustomTimeSlotChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const newSlots = [...customTimeSlots];
    newSlots[index][field] = value;
    setCustomTimeSlots(newSlots);
    
    // Update preview after changing a time slot
    if (startDate && selectedTemplates.includes('custom')) {
      generateSchedulePreview(startDate, 'custom');
    }
  };

  // Generate schedule preview
  const generateSchedulePreview = (date: string, templateId?: string) => {
    if (!date) return;
    
    const eventDates = generateRepeatedDates(date, repeatConfig);
    const preview: SchedulePreview[] = [];
    
    // For each date, collect all time slots from selected templates
    eventDates.forEach(eventDate => {
      const slots: SchedulePreview['slots'] = [];
      
      // Add slots from all selected templates
      const templatesToUse = templateId ? [templateId] : selectedTemplates;
      
      templatesToUse.forEach(templateId => {
        if (templateId === 'custom') {
          // Add custom time slots
          customTimeSlots.forEach((slot, index) => {
            if (slot.startTime && slot.endTime) {
              slots.push({
                id: `custom-${index}`,
                startTime: slot.startTime,
                endTime: slot.endTime,
                template: 'Custom'
              });
            }
          });
        } else {
          // Add template time slots
          const template = timeTemplates.find(t => String(t.id) === templateId);
          if (template) {
            template.timeSlots.forEach((slot, index) => {
              slots.push({
                id: `${templateId}-${index}`,
                startTime: slot.startTime,
                endTime: slot.endTime,
                template: template.name
              });
            });
          }
        }
      });
      
      // Sort slots by start time
      slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
      
      preview.push({
        date: eventDate,
        slots
      });
    });
    
    setSchedulePreview(preview);
  };

  // Handle date change
  const handleDateChange = (date: string) => {
    setStartDate(date);
    generateSchedulePreview(date);
  };

  // Format time for display
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
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
    
    try {
      // Get submitEvent function from EventSubmitter
      const { submitEvent } = await import('@/components/events/EventSubmitter');
      
      // Prepare scheduleData from templates and custom slots
      const scheduleData = selectedTemplates.map(templateId => {
        if (templateId === 'custom') {
          return {
            id: 'custom',
            name: 'Custom Schedule',
            timeSlots: customTimeSlots
          };
        } else {
          const template = timeTemplates.find(t => String(t.id) === templateId);
          return template;
        }
      }).filter(Boolean);
      
      // Check if custom time slots are filled when custom template is selected
      if (selectedTemplates.includes('custom')) {
        const hasValidTimeSlots = customTimeSlots.every(slot => 
          slot.startTime && slot.endTime
        );

        if (!hasValidTimeSlots) {
          alert("Please fill in all custom time slots");
          setIsSubmitting(false);
          return;
        }
      }

      try {
        // Generate all event dates
        const eventDates = generateRepeatedDates(startDate, repeatConfig);
        
        // Collect all time slots from selected templates
        let allTimeSlots: TimeSlot[] = [];
        
        selectedTemplates.forEach(templateId => {
          if (templateId === 'custom') {
            allTimeSlots = [...allTimeSlots, ...customTimeSlots];
          } else {
            const template = timeTemplates.find(t => String(t.id) === templateId);
            if (template) {
              allTimeSlots = [...allTimeSlots, ...template.timeSlots];
            }
          }
        });
        
        // Sort time slots by start time
        allTimeSlots.sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        // Create date slots for each generated date
        const generatedDateSlots = eventDates.map(date => ({
          date,
          timeSlots: [...allTimeSlots]
        }));

        const eventData = {
          name,
          description,
          duration,
          price: parseFloat(price),
          dateSlots: generatedDateSlots,
          providerId: user?.id,
          isActive: true,
          createdAt: new Date().toISOString(),
          image: eventImage,
          repeatConfig: repeatConfig.enabled ? repeatConfig : null,
          templates: selectedTemplates
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
    } catch (error) {
      console.error("Error importing EventSubmitter:", error);
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

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Event Details Section */}
        <EventDetailsSection
          name={name}
          setName={setName}
          description={description}
          setDescription={setDescription}
          duration={duration}
          setDuration={setDuration}
          price={price}
          setPrice={setPrice}
          itemVariants={itemVariants}
        />

        {/* Image Upload Section */}
        <ImageUploadSection
          eventImage={eventImage}
          setEventImage={setEventImage}
          imagePreview={imagePreview}
          setImagePreview={setImagePreview}
          itemVariants={itemVariants}
        />

        {/* Schedule Setup Section */}
        <ScheduleSection
          timeTemplates={timeTemplates as unknown as Template[]}
          onScheduleChange={setValidSchedules}
        />

        {/* Repeat Settings Section */}
        {/* <RepeatSettingsSection
          repeatConfig={repeatConfig}
          setRepeatConfig={setRepeatConfig}
          startDate={startDate}
          itemVariants={itemVariants}
        /> */}

        {/* Submit Buttons Section */}
        <motion.div variants={itemVariants} className="flex justify-end space-x-4 pt-4 mt-6 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm"
          >
            Cancel
          </button>
          
          <EventSubmitter 
            eventData={{
              name,
              description,
              duration,
              price,
              eventImage,
              startDate,
              scheduleData: validSchedules,
              repeatConfig
            }}
            redirectOnSuccess={true}
            redirectPath="/provider/events"
            showAlerts={true}
            buttonText={
              <>
                <svg className="h-4 w-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Create Event
              </>
            }
          />
        </motion.div>
      </form>
    </motion.div>
  );
}