import { useState, Children, isValidElement, cloneElement, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Service from '@/apis/Service';
import { RepeatConfig } from './types';

// Unified interface for event data
export interface EventData {
  name: string;
  description: string;
  duration: number;
  price: string | number;
  eventImage: File | null;
  startDate: string;
  scheduleData: any[];
  repeatConfig: RepeatConfig;
  onSubmitStart?: () => void;
  onSubmitComplete?: (success: boolean, eventId?: string, error?: string) => void;
}

// Hook for event submission logic
export const useSubmitEvent = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submitEvent = async ({
    name,
    description,
    duration,
    price,
    eventImage,
    startDate,
    scheduleData,
    repeatConfig,
    onSubmitStart,
    onSubmitComplete
  }: EventData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      if (onSubmitStart) {
        onSubmitStart();
      }

      // Basic validation
      if (!name || !description || !startDate || scheduleData.length === 0) {
        console.log(name, description, startDate, scheduleData);
        const errorMessage = "Please fill in all required fields and set up your schedule";
        setError(errorMessage);
        if (onSubmitComplete) onSubmitComplete(false, undefined, errorMessage);
        return false;
      }

      // Format the data for API submission
      const formattedData = {
        name,
        description,
        duration,
        price: typeof price === 'string' ? parseFloat(price) : price,
        startDate,
        scheduleData,
        repeatConfig
      };

      // Submit the event data
      const response = await Service.createService(formattedData);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to create event";
        setError(errorMessage);
        if (onSubmitComplete) onSubmitComplete(false, undefined, errorMessage);
        return false;
      }

      const data = await response.json();
      const eventId = data.id;

      // Upload image if available
      if (eventImage && eventId) {
        const imageResponse = await Service.uploadEventImage(eventId, eventImage);
        
        if (!imageResponse.ok) {
          console.warn('Failed to upload event image, but event was created');
          // Continue since the event was created successfully
        }
      }

      // Success!
      if (onSubmitComplete) onSubmitComplete(true, eventId);
      return true;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      if (onSubmitComplete) onSubmitComplete(false, undefined, errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitEvent,
    isSubmitting,
    error
  };
};

// Simple button component
export const SubmitEventButton: React.FC<{
  eventData: Omit<EventData, 'onSubmitStart' | 'onSubmitComplete'>;
  onSuccess?: (eventId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}> = ({ eventData, onSuccess, onError, className, children }) => {
  const { submitEvent, isSubmitting } = useSubmitEvent();
  
  const handleClick = async () => {
    await submitEvent({
      ...eventData,
      onSubmitComplete: (success, eventId, error) => {
        if (success && eventId && onSuccess) {
          onSuccess(eventId);
        } else if (!success && error && onError) {
          onError(error);
        }
      }
    });
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={handleClick}
      className={className || `px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center shadow-sm ${
        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Submitting...
        </>
      ) : children || 'Create Event'}
    </button>
  );
};

// Full featured EventSubmitter component with more options
export const EventSubmitter: React.FC<{
  eventData: EventData;
  onSuccess?: (eventId: string) => void;
  onError?: (error: string) => void;
  redirectOnSuccess?: boolean;
  redirectPath?: string;
  showAlerts?: boolean;
  className?: string;
  children?: ReactNode;
  buttonText?: string | ReactNode;
  loadingText?: string;
}> = ({
  eventData,
  onSuccess,
  onError,
  redirectOnSuccess = true,
  redirectPath = '/provider/events',
  showAlerts = true,
  className,
  children,
  buttonText = 'Create Event',
  loadingText = 'Submitting...'
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Basic validation
      if (!eventData.name || !eventData.description || !eventData.price) {
        console.log("Validation failed. Event data:", {
          name: eventData.name,
          description: eventData.description,
          price: eventData.price,
          scheduleDataLength: eventData.scheduleData?.length,
          scheduleData: eventData.scheduleData
        });
        
        const error = "Please fill in all required fields and set up your schedule";
        if (showAlerts) {
          alert(error);
        }
        if (onError) {
          onError(error);
        }
        setIsSubmitting(false);
        return;
      }

      // Format data for API
      const formattedData = {
        ...eventData,
        price: typeof eventData.price === 'string' ? parseFloat(eventData.price) : eventData.price
      };

      // Submit the event data
      const response = await Service.createService(formattedData);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to create event";
        
        if (showAlerts) {
          alert(errorMessage);
        }
        if (onError) {
          onError(errorMessage);
        }
        setIsSubmitting(false);
        return;
      }

      const data = await response.json();
      const eventId = data.id;

      // Upload image if available
      if (eventData.eventImage && eventId) {
        const imageResponse = await Service.uploadEventImage(eventId, eventData.eventImage);
        
        if (!imageResponse.ok) {
          console.warn('Failed to upload event image, but event was created');
        }
      }

      // Success handling
      if (showAlerts) {
        alert("Event created successfully!");
      }
      
      if (onSuccess) {
        onSuccess(eventId);
      }
      
      if (redirectOnSuccess) {
        router.push(redirectPath);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      
      if (showAlerts) {
        alert(errorMessage);
      }
      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // If children are provided, clone them with onClick handler
  if (children) {
    return (
      <>
        {Children.map(children, child => {
          if (isValidElement(child)) {
            return cloneElement(child, {
              onClick: handleSubmit,
              disabled: isSubmitting || (child.props as any).disabled
            } as any);
          }
          return child;
        })}
      </>
    );
  }

  // Otherwise render default button
  return (
    <button
      type="button"
      disabled={isSubmitting}
      onClick={handleSubmit}
      className={className || `px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center shadow-sm ${
        isSubmitting ? "opacity-75 cursor-not-allowed" : ""
      }`}
    >
      {isSubmitting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {loadingText}
        </>
      ) : buttonText}
    </button>
  );
};

// Standalone function for direct use
export const submitEvent = async (eventData: EventData): Promise<{success: boolean, eventId?: string, error?: string}> => {
  try {
    // Call the onSubmitStart callback if provided
    if (eventData.onSubmitStart) {
      eventData.onSubmitStart();
    }
    
    // Format the data for API submission
    const formattedData = {
      name: eventData.name,
      description: eventData.description,
      duration: eventData.duration,
      price: typeof eventData.price === 'string' ? parseFloat(eventData.price) : eventData.price,
      startDate: eventData.startDate,
      scheduleData: eventData.scheduleData,
      repeatConfig: eventData.repeatConfig
    };

    // Submit the event data
    const response = await Service.createService(formattedData);

    if (!response.ok) {
      const errorData = await response.json();
      const error = errorData.message || "Failed to create event";
      
      if (eventData.onSubmitComplete) {
        eventData.onSubmitComplete(false, undefined, error);
      }
      
      return {success: false, error};
    }

    const data = await response.json();
    const eventId = data.id;

    // Upload image if available
    if (eventData.eventImage && eventId) {
      await Service.uploadEventImage(eventId, eventData.eventImage);
    }

    // Call the onSubmitComplete callback with success=true if provided
    if (eventData.onSubmitComplete) {
      eventData.onSubmitComplete(true, eventId);
    }

    return {success: true, eventId};
  } catch (err) {
    const error = err instanceof Error ? err.message : "An unexpected error occurred";
    
    if (eventData.onSubmitComplete) {
      eventData.onSubmitComplete(false, undefined, error);
    }
    
    return {success: false, error};
  }
}; 