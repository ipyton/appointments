import {
  ClockIcon,
  PencilIcon,
  TrashIcon,
  CalendarIcon,
  DocumentDuplicateIcon
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

// Updated interfaces to match the LocalTemplate interface used in page.tsx
interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
  selected: boolean;
}

interface DaySchedule {
  id: string;
  dayName: string;
  dayIndex: number;
  timeRanges: TimeRange[];
}

interface Template {
  name: string;
  description?: string;
  daySchedules: DaySchedule[];
}

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (templateName: string) => void;
  variants: Variants; // Animation variants
}

// Helper function to format time (you might want to import this from your utils)
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour12 = parseInt(hours) % 12 || 12;
  const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
  return `${hour12}:${minutes} ${ampm}`;
};

export default function TemplateCard({ 
  template, 
  onEdit, 
  onDelete, 
  variants 
}: TemplateCardProps) {
  // Calculate total time ranges across all days
  const totalTimeRanges = template.daySchedules.reduce(
    (total, day) => total + day.timeRanges.length, 
    0
  );

  // Get day names for display
  const dayNames = template.daySchedules.map(day => day.dayName).join(', ');
  
  // Handle copy template
  const handleCopyTemplate = () => {
    // Create a deep copy of the template
    const copiedTemplate: Template = JSON.parse(JSON.stringify(template));
    
    // Modify the name to indicate it's a copy
    copiedTemplate.name = `${template.name} (Copy)`;
    
    // Generate new IDs for all days and time ranges to ensure uniqueness
    copiedTemplate.daySchedules = copiedTemplate.daySchedules.map(day => ({
      ...day,
      id: `day_${Date.now()}_${Math.random()}`,
      timeRanges: day.timeRanges.map(range => ({
        ...range,
        id: `time_${Date.now()}_${Math.random()}`
      }))
    }));
    
    // Pass the copied template to onEdit which will open the modal with the copied template
    onEdit(copiedTemplate);
  };

  return (
    <motion.div 
      variants={variants}
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow w-full max-w-md"
    >
      {/* Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {template.name}
            </h2>
            {template.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {template.description}
              </p>
            )}
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <span>
                {template.daySchedules.length} day{template.daySchedules.length !== 1 ? 's' : ''}
              </span>
              <span>•</span>
              <span>
                {totalTimeRanges} time slot{totalTimeRanges !== 1 ? 's' : ''}
              </span>
            </div>
            {template.daySchedules.length > 0 && (
              <p className="text-xs text-gray-400 mt-1 truncate">
                Days: {dayNames}
              </p>
            )}
          </div>
          
          <div className="flex space-x-2 ml-4">
            {/* Edit button */}
            <button
              onClick={() => onEdit(template)}
              className="p-1.5 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              aria-label="Edit template"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            
            {/* Copy button */}
            <button
              onClick={handleCopyTemplate}
              className="p-1.5 rounded-md bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
              aria-label="Copy template"
            >
              <DocumentDuplicateIcon className="h-4 w-4" />
            </button>
            
            {/* Delete button */}
            <button
              onClick={() => onDelete(template.name)}
              className="p-1.5 rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
              aria-label="Delete template"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Day Schedules */}
      <div className="p-5 bg-gray-50 max-h-64 overflow-y-auto">
        {template.daySchedules.length === 0 ? (
          <div className="text-center py-4 text-gray-400 text-sm">
            No schedules configured
          </div>
        ) : (
          <div className="space-y-4">
            {template.daySchedules.map((day, index) => (
              <div key={day.id} className="bg-white rounded-lg p-3 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-800">
                    <span className="inline-block min-w-16">Day {index + 1}:</span> {day.dayName}
                  </h4>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {day.timeRanges.length} slot{day.timeRanges.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {day.timeRanges.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No time ranges</p>
                ) : (
                  <div className="space-y-1">
                    {day.timeRanges
                      .sort((a, b) => {
                        const timeToMinutes = (time: string) => {
                          const [hours, minutes] = time.split(':').map(Number);
                          return hours * 60 + minutes;
                        };
                        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
                      })
                      .slice(0, 3) // Show only first 3 time ranges to save space
                      .map((range) => (
                        <div key={range.id} className="flex items-center space-x-2 text-xs text-gray-600">
                          <ClockIcon className="h-3 w-3 text-blue-500 flex-shrink-0" />
                          <span className="font-mono">
                            {formatTime(range.startTime)} - {formatTime(range.endTime)}
                          </span>
                        </div>
                      ))}
                    {day.timeRanges.length > 3 && (
                      <div className="text-xs text-gray-400 italic">
                        +{day.timeRanges.length - 3} more time{day.timeRanges.length - 3 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </motion.div>
  );
}