// Interface for template time ranges
export interface TimeRange {
  id: string;
  startTime: string;
  endTime: string;
  selected?: boolean;
}

// Interface for template
export interface Template {
  name: string;
  description?: string;
  timeRanges: TimeRange[];
}

// Helper function to format time to display in 12-hour format
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
} 