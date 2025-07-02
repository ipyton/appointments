import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown,
  Calendar,
  AlertTriangle,
  Copy,
  Clock,
  X,
  Save
} from "lucide-react";

// Updated types to match backend models
interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
  selected: boolean;
}

interface DaySchedule {
  id: string;
  dayIndex: number;
  timeRanges: TimeRange[];
}

interface Template {
  name: string;
  description?: string;
  daySchedules: DaySchedule[];
}

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Template) => void;
  initialTemplate?: Template;
}

const DAYS_OF_WEEK = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function TemplateModal({ 
  isOpen, 
  onClose, 
  onSave, 
  initialTemplate 
}: TemplateModalProps) {
  const [template, setTemplate] = useState<Template>({ 
    name: "", 
    description: "",
    daySchedules: [] 
  });
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isVisible, setIsVisible] = useState(false);

  // Animation control
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Reset template when modal opens with new initialTemplate
  useEffect(() => {
    if (isOpen) {
      if (initialTemplate) {
        setTemplate(JSON.parse(JSON.stringify(initialTemplate))); // Deep copy
      } else {
        setTemplate({ name: "", description: "", daySchedules: [] });
      }
      setValidationErrors({});
    }
  }, [isOpen, initialTemplate]);

  // Time validation functions
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const validateTimeRanges = (timeRanges: TimeRange[]): string[] => {
    const errors: string[] = [];
    const sortedRanges = [...timeRanges].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    
    for (let i = 0; i < sortedRanges.length; i++) {
      const current = sortedRanges[i];
      const startMinutes = timeToMinutes(current.startTime);
      const endMinutes = timeToMinutes(current.endTime);
      
      // Check if start time is before end time
      if (startMinutes >= endMinutes) {
        errors.push(`Time range ${i + 1}: Start time must be before end time`);
      }
      
      // Check for overlaps with next range
      if (i < sortedRanges.length - 1) {
        const next = sortedRanges[i + 1];
        const nextStartMinutes = timeToMinutes(next.startTime);
        
        if (endMinutes > nextStartMinutes) {
          errors.push(`Time ranges ${i + 1} and ${i + 2}: Overlapping times detected`);
        }
      }
    }
    
    return errors;
  };

  const sortTimeRanges = (dayId: string) => {
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      daySchedules: prevTemplate.daySchedules.map(day => {
        if (day.id !== dayId) return day;
        
        const sortedRanges = [...day.timeRanges].sort((a, b) => 
          timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );
        
        return { ...day, timeRanges: sortedRanges };
      })
    }));
  };

  // Day management functions
  const addDay = () => {
    const newDay: DaySchedule = {
      id: `day_${Date.now()}_${Math.random()}`,
      dayIndex: template.daySchedules.length,
      timeRanges: []
    };
    
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      daySchedules: [...prevTemplate.daySchedules, newDay]
    }));
  };

  const copyDay = (dayId: string) => {
    const dayToCopy = template.daySchedules.find(day => day.id === dayId);
    if (!dayToCopy) return;
    
    // Create deep copy of time ranges with new IDs
    const copiedTimeRanges = dayToCopy.timeRanges.map(range => ({
      ...range,
      id: `time_${Date.now()}_${Math.random()}`
    }));
    
    const copiedDay: DaySchedule = {
      id: `day_${Date.now()}_${Math.random()}`,
      dayIndex: template.daySchedules.length,
      timeRanges: copiedTimeRanges
    };
    
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      daySchedules: [...prevTemplate.daySchedules, copiedDay]
    }));
  };

  const removeDay = (dayId: string) => {
    setTemplate(prevTemplate => {
      const newDaySchedules = prevTemplate.daySchedules.filter(day => day.id !== dayId);
      
      // Reindex remaining days
      const reindexedDays = newDaySchedules.map((day, index) => ({
        ...day,
        dayIndex: index
      }));
      
      return {
        ...prevTemplate,
        daySchedules: reindexedDays
      };
    });
    
    // Clear validation errors for removed day
    setValidationErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[dayId];
      return newErrors;
    });
  };

  const moveDayUp = (dayId: string) => {
    const dayIndex = template.daySchedules.findIndex(day => day.id === dayId);
    if (dayIndex > 0) {
      setTemplate(prevTemplate => {
        const newDaySchedules = [...prevTemplate.daySchedules];
        [newDaySchedules[dayIndex], newDaySchedules[dayIndex - 1]] = 
        [newDaySchedules[dayIndex - 1], newDaySchedules[dayIndex]];
        
        // Update dayIndex values to match their new positions
        return { 
          ...prevTemplate, 
          daySchedules: newDaySchedules.map((day, idx) => ({
            ...day,
            dayIndex: idx
          }))
        };
      });
    }
  };

  const moveDayDown = (dayId: string) => {
    const dayIndex = template.daySchedules.findIndex(day => day.id === dayId);
    if (dayIndex < template.daySchedules.length - 1) {
      setTemplate(prevTemplate => {
        const newDaySchedules = [...prevTemplate.daySchedules];
        [newDaySchedules[dayIndex], newDaySchedules[dayIndex + 1]] = 
        [newDaySchedules[dayIndex + 1], newDaySchedules[dayIndex]];
        
        // Update dayIndex values to match their new positions
        return { 
          ...prevTemplate, 
          daySchedules: newDaySchedules.map((day, idx) => ({
            ...day,
            dayIndex: idx
          }))
        };
      });
    }
  };

  // Time range management functions
  const addTimeRange = (dayId: string) => {
    const day = template.daySchedules.find(d => d.id === dayId);
    let defaultStartTime = "09:00";
    let defaultEndTime = "10:00";
    
    // If there are existing time ranges, set default to after the last one
    if (day && day.timeRanges.length > 0) {
      const sortedRanges = [...day.timeRanges].sort((a, b) => 
        timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
      );
      const lastRange = sortedRanges[sortedRanges.length - 1];
      const lastEndMinutes = timeToMinutes(lastRange.endTime);
      
      // Start 30 minutes after the last range ends
      const newStartMinutes = lastEndMinutes + 30;
      const newEndMinutes = newStartMinutes + 60;
      
      const formatTime = (minutes: number) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      };
      
      if (newStartMinutes < 24 * 60) {
        defaultStartTime = formatTime(newStartMinutes);
        defaultEndTime = formatTime(Math.min(newEndMinutes, 23 * 60 + 59));
      }
    }
    
    const newTimeRange: TimeRange = {
      id: `time_${Date.now()}_${Math.random()}`,
      startTime: defaultStartTime,
      endTime: defaultEndTime,
      selected: false
    };
    
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      daySchedules: prevTemplate.daySchedules.map(day =>
        day.id === dayId 
          ? { ...day, timeRanges: [...day.timeRanges, newTimeRange] }
          : day
      )
    }));
    
    // Auto-sort after adding with a delay
    setTimeout(() => {
      sortTimeRanges(dayId);
    }, 100);
  };

  const removeTimeRange = (dayId: string, timeRangeId: string) => {
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      daySchedules: prevTemplate.daySchedules.map(day =>
        day.id === dayId
          ? { ...day, timeRanges: day.timeRanges.filter(range => range.id !== timeRangeId) }
          : day
      )
    }));
  };

  const handleTimeRangeChange = (dayId: string, timeRangeId: string, field: 'startTime' | 'endTime', value: string) => {
    setTemplate(prevTemplate => ({
      ...prevTemplate,
      daySchedules: prevTemplate.daySchedules.map(day =>
        day.id === dayId
          ? {
              ...day,
              timeRanges: day.timeRanges.map(range =>
                range.id === timeRangeId ? { ...range, [field]: value } : range
              )
            }
          : day
      )
    }));
    
    // Auto-sort and validate after a short delay
    setTimeout(() => {
      sortTimeRanges(dayId);
      validateDay(dayId);
    }, 100);
  };

  const validateDay = (dayId: string) => {
    const day = template.daySchedules.find(d => d.id === dayId);
    if (!day) return;
    
    const errors = validateTimeRanges(day.timeRanges);
    
    setValidationErrors(prevErrors => {
      const newValidationErrors = { ...prevErrors };
      
      if (errors.length > 0) {
        newValidationErrors[dayId] = errors.join('; ');
      } else {
        delete newValidationErrors[dayId];
      }
      
      return newValidationErrors;
    });
  };

  const handleSave = () => {
    if (!template.name.trim()) {
      alert("Please provide a template name");
      return;
    }
    
    if (template.daySchedules.length === 0) {
      alert("Please add at least one day");
      return;
    }
    
    // Validate all days
    const allErrors: string[] = [];
    template.daySchedules.forEach((day, index) => {
      const errors = validateTimeRanges(day.timeRanges);
      if (errors.length > 0) {
        allErrors.push(`Day ${index + 1}: ${errors.join('; ')}`);
      }
    });
    
    if (allErrors.length > 0) {
      alert(`Please fix the following time conflicts:\n\n${allErrors.join('\n')}`);
      return;
    }
    console.log("saving template");
    console.log(template);
    onSave(template);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialTemplate ? `Edit Template: ${template.name || 'Untitled'}` : 'Create New Template'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        {/* Template Name */}
        <div className="mb-6">
          <label htmlFor="templateName" className="block text-sm font-medium text-gray-700 mb-1">
            Template Name *
          </label>
          <input
            type="text"
            id="templateName"
            value={template.name}
            onChange={(e) => setTemplate(prev => ({...prev, name: e.target.value}))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="e.g. Weekly Schedule, Work Hours Template"
          />
        </div>
        
        {/* Template Description */}
        <div className="mb-6">
          <label htmlFor="templateDescription" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="templateDescription"
            value={template.description || ""}
            onChange={(e) => setTemplate(prev => ({...prev, description: e.target.value}))}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            placeholder="Add a brief description of this template"
            rows={3}
          />
        </div>
        
        {/* Days Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Day Schedules
            </h3>
            <button
              type="button"
              onClick={addDay}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              Add Day
            </button>
          </div>
          
          {template.daySchedules.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-lg font-medium">No days added yet</p>
              <p className="text-sm mt-1">Click "Add Day" to get started with your template</p>
            </div>
          ) : (
            <div className="space-y-4">
              {template.daySchedules.map((day, dayIndex) => (
                <div key={day.id} className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {day.dayIndex + 1}
                        </span>
                        <span className="font-medium text-gray-700">
                          Day {day.dayIndex + 1}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                          {day.timeRanges.length} time range{day.timeRanges.length !== 1 ? 's' : ''}
                        </span>
                        {day.timeRanges.length === 0 && (
                          <span className="ml-2 text-sm font-medium px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700">
                            Empty day
                          </span>
                        )}
                      </div>
                      {validationErrors[day.id] && (
                        <div className="flex items-center text-red-600 text-sm ml-2">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          <span className="font-medium">Time conflicts</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {/* Day reorder buttons */}
                      <div className="flex border rounded-md overflow-hidden">
                        <button
                          type="button"
                          onClick={() => moveDayUp(day.id)}
                          disabled={dayIndex === 0}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed border-r"
                          title="Move day up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveDayDown(day.id)}
                          disabled={dayIndex === template.daySchedules.length - 1}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move day down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {/* Copy day button */}
                      <button
                        type="button"
                        onClick={() => copyDay(day.id)}
                        className="inline-flex items-center px-2.5 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-xs font-medium border border-green-200"
                        title="Copy this day"
                      >
                        <Copy className="h-3.5 w-3.5 mr-1" />
                        Copy
                      </button>
                      
                      {/* Add time range button */}
                      <button
                        type="button"
                        onClick={() => addTimeRange(day.id)}
                        className="inline-flex items-center px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors text-xs font-medium border border-blue-200"
                        title="Add time range"
                      >
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        Add Time
                      </button>
                      
                      {/* Remove day button */}
                      <button
                        type="button"
                        onClick={() => removeDay(day.id)}
                        className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                        title="Remove day"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Validation Error Display */}
                  {validationErrors[day.id] && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                      <div className="flex items-start">
                        <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-red-700">
                          <strong>Time Conflicts:</strong>
                          <div className="mt-1">{validationErrors[day.id]}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Time Ranges */}
                  {day.timeRanges.length === 0 ? (
                    <div className="text-center py-6 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                      <Clock className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p className="text-sm font-medium">This is an empty day with no scheduled time ranges</p>
                      <button
                        onClick={() => addTimeRange(day.id)}
                        className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-800 inline-flex items-center"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Time Range
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {day.timeRanges
                        .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
                        .map((range, rangeIndex) => (
                          <div key={range.id} className="flex items-center space-x-4 bg-gray-50 p-3.5 rounded-lg border border-gray-100 hover:border-gray-200 transition-all duration-200">
                            <div className="flex items-center justify-center w-7 h-7 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex-shrink-0">
                              {rangeIndex + 1}
                            </div>
                            
                            <div className="flex-1 grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  value={range.startTime}
                                  onChange={(e) => handleTimeRangeChange(day.id, range.id, 'startTime', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                              </div>
                              
                              <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  value={range.endTime}
                                  onChange={(e) => handleTimeRangeChange(day.id, range.id, 'endTime', e.target.value)}
                                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                                />
                              </div>
                            </div>
                            
                            <button
                              type="button"
                              onClick={() => removeTimeRange(day.id, range.id)}
                              className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors"
                              title="Remove time range"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        
                        <button
                          onClick={() => addTimeRange(day.id)}
                          className="w-full mt-2 py-2 border border-dashed border-gray-200 rounded-lg text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all duration-200 flex items-center justify-center"
                        >
                          <Plus className="h-4 w-4 mr-1.5" />
                          Add Another Time Range
                        </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Summary */}
        {template.daySchedules.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              Template Summary
            </h4>
            <div className="grid grid-cols-3 gap-2 text-sm">
              <div className="bg-white p-2.5 rounded-md border border-blue-100 flex flex-col items-center">
                <span className="text-lg font-semibold text-blue-800">{template.daySchedules.length}</span>
                <span className="text-xs text-gray-500">Total days</span>
              </div>
              <div className="bg-white p-2.5 rounded-md border border-blue-100 flex flex-col items-center">
                <span className="text-lg font-semibold text-blue-800">
                  {template.daySchedules.reduce((acc, day) => acc + day.timeRanges.length, 0)}
                </span>
                <span className="text-xs text-gray-500">Time ranges</span>
              </div>
              <div className="bg-white p-2.5 rounded-md border border-blue-100 flex flex-col items-center">
                <span className="text-lg font-semibold text-blue-800">
                  {template.daySchedules.filter(day => day.timeRanges.length === 0).length}
                </span>
                <span className="text-xs text-gray-500">Empty days</span>
              </div>
            </div>
            {Object.keys(validationErrors).length > 0 && (
              <div className="mt-3 p-2.5 bg-red-50 border border-red-200 rounded-md text-center">
                <div className="text-red-600 font-medium text-sm flex items-center justify-center">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  {Object.keys(validationErrors).length} day(s) have time conflicts
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="mt-8 flex justify-end space-x-3 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={Object.keys(validationErrors).length > 0}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow-md flex items-center"
          >
            <Save className="h-4 w-4 mr-1.5" />
            Save Template
          </button>
        </div>
      </div>
    </div>
  );
}