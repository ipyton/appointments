import { ClockIcon } from "@heroicons/react/24/outline";
import { motion, Variants } from "framer-motion";

interface EmptyStateProps {
  onCreateTemplate: () => void;
  variants: Variants; // Animation variants
}

export default function EmptyState({ onCreateTemplate, variants }: EmptyStateProps) {
  return (
    <motion.div 
      variants={variants} 
      className="bg-white rounded-xl shadow-sm p-10 text-center"
    >
      <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
        <ClockIcon className="h-8 w-8 text-blue-600" />
      </div>
      <h2 className="text-xl font-medium text-gray-900 mb-2">No Templates Yet</h2>
      <p className="text-gray-500 mb-6">
        Create templates to quickly set up recurring time slots on your calendar.
      </p>
      <button
        onClick={onCreateTemplate}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Your First Template
      </button>
    </motion.div>
  );
} 