import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, Eye, Columns, GripVertical, AlertCircle } from 'lucide-react';

// Updated interfaces
interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface TemplateDay {
  dayNumber: number; // Day 1, 2, 3, etc.
  timeSlots: TimeSlot[];
}

interface TimeTemplate {
  id: string;
  name: string;
  description: string;
  days: TemplateDay[];
  duration: number; // Total number of days
}

interface EventSchedule {
  id: string;
  templateId: string;
  templateName: string;
  startDate: string;
  order: number;
}

interface SchedulePreview {
  date: string;
  slots: {
    id: string;
    startTime: string;
    endTime: string;
    template: string;
    eventId: string;
    dayNumber: number;
  }[];
}

// Sample templates with multiple days
const sampleTimeTemplates: TimeTemplate[] = [
  {
    id: 'workshop-3day',
    name: '3-Day Workshop',
    description: 'Intensive 3-day workshop format',
    duration: 3,
    days: [
      {
        dayNumber: 1,
        timeSlots: [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '13:00', endTime: '17:00' }
        ]
      },
      {
        dayNumber: 2,
        timeSlots: [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '13:00', endTime: '16:00' }
        ]
      },
      {
        dayNumber: 3,
        timeSlots: [
          { startTime: '10:00', endTime: '15:00' }
        ]
      }
    ]
  },
  {
    id: 'conference-2day',
    name: '2-Day Conference',
    description: 'Standard conference schedule',
    duration: 2,
    days: [
      {
        dayNumber: 1,
        timeSlots: [
          { startTime: '08:00', endTime: '12:00' },
          { startTime: '13:30', endTime: '18:00' }
        ]
      },
      {
        dayNumber: 2,
        timeSlots: [
          { startTime: '09:00', endTime: '13:00' },
          { startTime: '14:00', endTime: '16:30' }
        ]
      }
    ]
  },
  {
    id: 'training-5day',
    name: '5-Day Training',
    description: 'Week-long training program',
    duration: 5,
    days: [
      {
        dayNumber: 1,
        timeSlots: [
          { startTime: '09:00', endTime: '17:00' }
        ]
      },
      {
        dayNumber: 2,
        timeSlots: [
          { startTime: '09:00', endTime: '17:00' }
        ]
      },
      {
        dayNumber: 3,
        timeSlots: [
          { startTime: '09:00', endTime: '17:00' }
        ]
      },
      {
        dayNumber: 4,
        timeSlots: [
          { startTime: '09:00', endTime: '17:00' }
        ]
      },
      {
        dayNumber: 5,
        timeSlots: [
          { startTime: '09:00', endTime: '15:00' }
        ]
      }
    ]
  },
  {
    id: 'single-day',
    name: 'Single Day Event',
    description: 'One day intensive session',
    duration: 1,
    days: [
      {
        dayNumber: 1,
        timeSlots: [
          { startTime: '09:00', endTime: '12:00' },
          { startTime: '13:00', endTime: '17:00' }
        ]
      }
    ]
  }
];

export const ScheduleSection = () => {
  const [eventSchedules, setEventSchedules] = useState<EventSchedule[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [schedulePreview, setSchedulePreview] = useState<SchedulePreview[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});

  // Check if two time slots overlap
  const doTimeSlotsOverlap = (slot1: TimeSlot, slot2: TimeSlot): boolean => {
    // Convert times to comparable format (minutes since midnight)
    const getMinutes = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    };
    
    const slot1Start = getMinutes(slot1.startTime);
    const slot1End = getMinutes(slot1.endTime);
    const slot2Start = getMinutes(slot2.startTime);
    const slot2End = getMinutes(slot2.endTime);
    
    // Check if one slot starts before the other ends
    return (slot1Start < slot2End && slot1End > slot2Start);
  };

  // Check if adding or updating an event would cause overlaps
  const checkOverlaps = (newEvent: EventSchedule, currentIndex?: number): string | null => {
    if (!newEvent.templateId || !newEvent.startDate) return null;
    
    const template = sampleTimeTemplates.find(t => t.id === newEvent.templateId);
    if (!template) return null;
    
    const newEventDates = new Map<string, TimeSlot[]>();
    const newStartDate = new Date(newEvent.startDate);
    
    // Calculate all dates and time slots for the new event
    template.days.forEach(day => {
      const date = new Date(newStartDate);
      date.setDate(newStartDate.getDate() + (day.dayNumber - 1));
      const dateString = date.toISOString().split('T')[0];
      newEventDates.set(dateString, day.timeSlots);
    });
    
    // Check against all existing events (except the one being updated)
    for (let i = 0; i < eventSchedules.length; i++) {
      if (currentIndex !== undefined && i === currentIndex) continue;
      
      const existingEvent = eventSchedules[i];
      if (!existingEvent.templateId || !existingEvent.startDate) continue;
      
      const existingTemplate = sampleTimeTemplates.find(t => t.id === existingEvent.templateId);
      if (!existingTemplate) continue;
      
      const existingStartDate = new Date(existingEvent.startDate);
      
      // Check each day of the existing event
      for (const day of existingTemplate.days) {
        const existingDate = new Date(existingStartDate);
        existingDate.setDate(existingStartDate.getDate() + (day.dayNumber - 1));
        const existingDateString = existingDate.toISOString().split('T')[0];
        
        // If both events have slots on the same day
        if (newEventDates.has(existingDateString)) {
          const newTimeSlots = newEventDates.get(existingDateString)!;
          
          // Check each pair of time slots for overlaps
          for (const newSlot of newTimeSlots) {
            for (const existingSlot of day.timeSlots) {
              if (doTimeSlotsOverlap(newSlot, existingSlot)) {
                return `Schedule overlaps with "${existingEvent.templateName}" on ${new Date(existingDateString).toLocaleDateString()} (${existingSlot.startTime}-${existingSlot.endTime})`;
              }
            }
          }
        }
      }
    }
    
    return null;
  };

  const addEventSchedule = () => {
    const newEvent: EventSchedule = {
      id: `event-${Date.now()}`,
      templateId: '',
      templateName: '',
      startDate: '',
      order: eventSchedules.length
    };
    setEventSchedules([...eventSchedules, newEvent]);
    setValidationErrors({...validationErrors, [newEvent.id]: ''});
  };

  const removeEventSchedule = (index: number) => {
    const { id } = eventSchedules[index];
    const updatedSchedules = eventSchedules.filter((_, i) => i !== index);
    setEventSchedules(updatedSchedules.map((schedule, i) => ({ ...schedule, order: i })));
    
    // Remove any validation errors for this event
    const updatedErrors = {...validationErrors};
    delete updatedErrors[id];
    setValidationErrors(updatedErrors);
  };

  const updateEventSchedule = (index: number, field: keyof EventSchedule, value: string) => {
    const updatedSchedules = eventSchedules.map((schedule, i) => {
      if (i === index) {
        const updated = { ...schedule, [field]: value };
        if (field === 'templateId') {
          const template = sampleTimeTemplates.find(t => t.id === value);
          updated.templateName = template?.name || '';
        }
        return updated;
      }
      return schedule;
    });
    
    // Validate for overlaps
    const updatedEvent = updatedSchedules[index];
    const overlapError = checkOverlaps(updatedEvent, index);
    
    const updatedErrors = {...validationErrors};
    if (overlapError) {
      updatedErrors[updatedEvent.id] = overlapError;
    } else {
      updatedErrors[updatedEvent.id] = '';
    }
    
    setValidationErrors(updatedErrors);
    setEventSchedules(updatedSchedules);
  };

  const generateSchedulePreview = () => {
    const preview: SchedulePreview[] = [];
    const dateMap = new Map<string, SchedulePreview>();

    // Filter out events with validation errors
    const validEvents = eventSchedules.filter(event => !validationErrors[event.id]);

    validEvents.forEach(eventSchedule => {
      if (!eventSchedule.templateId || !eventSchedule.startDate) return;

      const template = sampleTimeTemplates.find(t => t.id === eventSchedule.templateId);
      if (!template) return;

      const startDate = new Date(eventSchedule.startDate);
      
      template.days.forEach(day => {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + (day.dayNumber - 1));
        const dateString = currentDate.toISOString().split('T')[0];

        if (!dateMap.has(dateString)) {
          dateMap.set(dateString, {
            date: dateString,
            slots: []
          });
        }

        const dayPreview = dateMap.get(dateString)!;
        
        day.timeSlots.forEach((slot, slotIndex) => {
          dayPreview.slots.push({
            id: `${eventSchedule.id}-day${day.dayNumber}-slot${slotIndex}`,
            startTime: slot.startTime,
            endTime: slot.endTime,
            template: eventSchedule.templateName,
            eventId: eventSchedule.id,
            dayNumber: day.dayNumber
          });
        });
      });
    });

    // Sort by date
    const sortedPreview = Array.from(dateMap.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Sort slots within each day by start time
    sortedPreview.forEach(day => {
      day.slots.sort((a, b) => a.startTime.localeCompare(b.startTime));
    });

    setSchedulePreview(sortedPreview);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const updatedSchedules = [...eventSchedules];
    const draggedSchedule = updatedSchedules[draggedItem];
    
    // Remove dragged item
    updatedSchedules.splice(draggedItem, 1);
    
    // Insert at new position
    updatedSchedules.splice(dropIndex, 0, draggedSchedule);
    
    // Update order numbers
    const reorderedSchedules = updatedSchedules.map((schedule, index) => ({
      ...schedule,
      order: index
    }));
    
    setEventSchedules(reorderedSchedules);
    setDraggedItem(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getTemplateColors = (templateName: string, index: number) => {
    const colors = [
      { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200' },
      { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200' },
      { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200' },
      { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200' },
      { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-200' },
      { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-200' }
    ];
    return colors[index % colors.length];
  };

  const hasValidSchedules = eventSchedules.some(e => 
    e.templateId && e.startDate && !validationErrors[e.id]
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-blue-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Event Schedule Builder</h2>
        </div>
        
        <button
          type="button"
          onClick={() => {
            if (hasValidSchedules) {
              setShowPreview(!showPreview);
              if (!showPreview) {
                generateSchedulePreview();
              }
            } else {
              alert("Please add at least one complete event (template + start date) without overlaps to preview");
            }
          }}
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium shadow-sm"
        >
          {showPreview ? (
            <>
              <Columns className="h-4 w-4 mr-2" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4 mr-2" />
              Show Preview
            </>
          )}
        </button>
      </div>

      {/* Event Schedules */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Event Schedules</h3>
          <button
            type="button"
            onClick={addEventSchedule}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </button>
        </div>

        {eventSchedules.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No template scheduled yet</p>
            <p className="text-gray-400 text-sm">Click "Add Template" to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {eventSchedules.map((eventSchedule, index) => (
              <div
                key={eventSchedule.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
                className={`bg-gray-50 rounded-lg p-4 border-2 border-dashed transition-all ${
                  draggedItem === index ? 'opacity-50 border-blue-400' : 
                  validationErrors[eventSchedule.id] ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 mt-2 cursor-move">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>
                  
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Template *
                      </label>
                      <select
                        value={eventSchedule.templateId}
                        onChange={(e) => updateEventSchedule(index, 'templateId', e.target.value)}
                        className={`w-full rounded-lg shadow-sm focus:ring-blue-500 transition-colors ${
                          validationErrors[eventSchedule.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        required
                      >
                        <option value="">Select a template</option>
                        {sampleTimeTemplates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.name} ({template.duration} day{template.duration > 1 ? 's' : ''})
                          </option>
                        ))}
                      </select>
                      {eventSchedule.templateId && !validationErrors[eventSchedule.id] && (
                        <p className="mt-1 text-xs text-gray-500">
                          {sampleTimeTemplates.find(t => t.id === eventSchedule.templateId)?.description}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={eventSchedule.startDate}
                        onChange={(e) => updateEventSchedule(index, 'startDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={`w-full rounded-lg shadow-sm focus:ring-blue-500 transition-colors ${
                          validationErrors[eventSchedule.id] ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'
                        }`}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeEventSchedule(index)}
                    className="flex-shrink-0 mt-6 text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Validation Error */}
                {validationErrors[eventSchedule.id] && (
                  <div className="mt-3 flex items-center text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span>{validationErrors[eventSchedule.id]}</span>
                  </div>
                )}

                {/* Template Preview */}
                {eventSchedule.templateId && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Template Overview</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                      {sampleTimeTemplates
                        .find(t => t.id === eventSchedule.templateId)
                        ?.days.map((day) => (
                          <div key={day.dayNumber} className="bg-white rounded-md p-3 border border-gray-200">
                            <div className="text-xs font-medium text-gray-600 mb-2">
                              Day {day.dayNumber}
                            </div>
                            <div className="space-y-1">
                              {day.timeSlots.map((slot, slotIndex) => (
                                <div key={slotIndex} className="text-xs text-gray-500">
                                  {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Preview */}
      {showPreview && schedulePreview.length > 0 && (
        <div className="border-t pt-6">
          <div className="flex items-center mb-6">
            <Eye className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Schedule Preview</h3>
          </div>
          
          <div className="space-y-8">
            {schedulePreview.slice(0, 10).map((day, dayIndex) => (
              <div key={dayIndex} className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">
                  {formatDate(day.date)}
                </h4>
                
                {day.slots.length > 0 ? (
                  <div className="space-y-3">
                    {day.slots.map((slot, slotIndex) => {
                      const colors = getTemplateColors(slot.template, slotIndex);
                      return (
                        <div
                          key={slot.id}
                          className={`${colors.bg} ${colors.border} border-l-4 rounded-lg p-4 shadow-sm`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className={`text-sm font-semibold ${colors.text} mb-1`}>
                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                              </div>
                              <div className={`text-sm ${colors.text} opacity-80`}>
                                {slot.template} (Day {slot.dayNumber})
                              </div>
                            </div>
                            <div className={`text-xs ${colors.text} opacity-60 bg-white px-2 py-1 rounded`}>
                              {Math.round(
                                (new Date(`2000-01-01T${slot.endTime}:00`).getTime() - 
                                 new Date(`2000-01-01T${slot.startTime}:00`).getTime()) / (1000 * 60 * 60)
                              )}h
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No time slots scheduled for this day
                  </div>
                )}
              </div>
            ))}
            
            {schedulePreview.length > 10 && (
              <div className="text-center text-sm text-gray-500 bg-gray-50 rounded-lg py-4">
                +{schedulePreview.length - 10} more days scheduled
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};