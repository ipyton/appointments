import { ArrowDownTrayIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { motion, Variants } from "framer-motion";
import { useRef } from "react";

// Define LocalTemplate interface to match what's used in page.tsx
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

interface LocalTemplate {
  name: string;
  description?: string;
  daySchedules: DaySchedule[];
}

interface TemplateActionsProps {
  onImport: (templates: LocalTemplate[]) => void;
  onExport: () => void;
  hasTemplates: boolean;
  variants: Variants; // Animation variants
}

export default function TemplateActions({ 
  onImport, 
  onExport, 
  hasTemplates, 
  variants 
}: TemplateActionsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedTemplates = JSON.parse(event.target?.result as string);
        
        if (Array.isArray(importedTemplates) && importedTemplates.every(t => 
          typeof t === 'object' && 
          typeof t.name === 'string' && 
          Array.isArray(t.daySchedules)
        )) {
          if (confirm(`Import ${importedTemplates.length} templates? This will replace your current templates.`)) {
            onImport(importedTemplates);
          }
        } else {
          alert("Invalid template format");
        }
      } catch (e) {
        console.error("Error parsing imported templates:", e);
        alert("Failed to import templates. The file format is invalid.");
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <motion.div variants={variants} className="flex space-x-4 mb-4">
      <button
        onClick={handleImportClick}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
      >
        <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
        Import Templates
      </button>
      <button
        onClick={onExport}
        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
        disabled={!hasTemplates}
      >
        <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
        Export Templates
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".json"
        className="hidden"
        onChange={handleFileUpload}
      />
    </motion.div>
  );
} 