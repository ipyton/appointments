import { DocumentTextIcon, ClockIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface EventDetailsSectionProps {
  name: string;
  setName: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  duration: number;
  setDuration: (value: number) => void;
  price: string;
  setPrice: (value: string) => void;
  itemVariants: any;
}

export const EventDetailsSection = ({
  name,
  setName,
  description,
  setDescription,
  duration,
  setDuration,
  price,
  setPrice,
  itemVariants
}: EventDetailsSectionProps) => {
  return (
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
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            Slot Duration *
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
            Unit Price (per slot) *
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
  );
}; 