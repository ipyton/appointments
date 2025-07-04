"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion, Variants } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Template } from "@/types/templates";
import TemplateCard from "@/components/templates/TemplateCard";
import TemplateModal from "@/components/templates/TemplateModal";
import EmptyState from "@/components/templates/EmptyState";
import TemplateActions from "@/components/templates/TemplateActions";
import Templates from "@/apis/Templates";

// Define a local Template interface that matches what's used in the components
interface LocalTemplate {
  name: string;
  description?: string;
  daySchedules: {
    id: string;
    dayName: string;
    dayIndex: number;
    timeRanges: {
      id: string;
      startTime: string;
      endTime: string;
      selected: boolean;
    }[];
  }[];
}

export default function TemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<LocalTemplate[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<LocalTemplate | undefined>(undefined);

  // Load templates from localStorage
  useEffect(() => {
    Templates.getTemplates().then(response => {
      if (response.ok) {
        response.json().then(data => {
          console.log(data);
          setTemplates(data);
        });
      }
    });
    
  }, []);
  
  // Save templates to localStorage when they change
  useEffect(() => {
    if (templates.length > 0) {
      localStorage.setItem('providerTemplates', JSON.stringify(templates));
    }
  }, [templates]);

  const openTemplateModal = (template?: LocalTemplate) => {
    setCurrentTemplate(template);
    setShowTemplateModal(true);
  };

  const closeTemplateModal = () => {
    setShowTemplateModal(false);
    setCurrentTemplate(undefined);
  };

  const handleSaveTemplate = (template: LocalTemplate) => {
    // Check if template name already exists

    Templates.upsertTemplate(template).then(response => {
      if (response.ok) {
        console.log(response);
        const exists = templates.some(t => t.name === template.name);
        if (exists) {
          // Update existing template
          console.log("updating template");
          console.log(template);
    
          setTemplates(templates.map(t => 
            t.name === template.name ? template : t
          ));
        } else {
          // Add new template
          setTemplates([...templates, template]);
        }
        
        closeTemplateModal();

      } else {
        console.log("Failed to save template");
      }
    });

  
  };

  const handleDeleteTemplate = (templateName: string) => {
    if (confirm(`Are you sure you want to delete the template "${templateName}"?`)) {
      setTemplates(templates.filter(t => t.name !== templateName));
    }
  };

  const handleImportTemplates = (importedTemplates: LocalTemplate[]) => {
    setTemplates(importedTemplates);
  };

  const handleExportTemplates = () => {
    const dataStr = JSON.stringify(templates);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
    
    const exportFileDefaultName = `calendar-templates-${new Date().toISOString().slice(0, 10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Time Templates</h1>
        <button
          onClick={() => openTemplateModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create New Template
        </button>
      </motion.div>

      <TemplateActions 
        onImport={handleImportTemplates}
        onExport={handleExportTemplates}
        hasTemplates={templates.length > 0}
        variants={itemVariants}
      />

      {templates.length === 0 ? (
        <EmptyState 
          onCreateTemplate={() => openTemplateModal()}
          variants={itemVariants}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
          {templates.map((template) => (
            <TemplateCard
              key={template.name}
              template={template}
              onEdit={openTemplateModal}
              onDelete={handleDeleteTemplate}
              variants={itemVariants}
            />
          ))}
        </div>
      )}

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={closeTemplateModal}
        onSave={handleSaveTemplate}
        initialTemplate={currentTemplate}
      />
    </motion.div>
  );
} 