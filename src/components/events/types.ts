export interface TimeSlot {
  startTime: string;
  endTime: string;
}

export interface TimeTemplate {
  id: string;
  name: string;
  timeSlots: TimeSlot[];
}

export interface DateSlot {
  date: string;
  timeSlots: TimeSlot[];
}

export interface SchedulePreview {
  date: string;
  slots: {
    id: string;
    startTime: string;
    endTime: string;
    template: string;
  }[];
}

export interface RepeatConfig {
  enabled: boolean;
  frequency: 'daily' | 'weekly' | 'monthly';
  interval: number; // every X days/weeks/months
  endDate: string;
  endAfter: number; // end after X occurrences
  endType: 'date' | 'occurrences' | 'never';
} 