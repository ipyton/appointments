import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface SubmitButtonsSectionProps {
  isSubmitting: boolean;
  itemVariants: any;
}

export const SubmitButtonsSection = ({
  isSubmitting,
  itemVariants
}: SubmitButtonsSectionProps) => {
  const router = useRouter();
  
  return (
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
  );
}; 