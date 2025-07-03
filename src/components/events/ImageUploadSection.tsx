import { PhotoIcon, TrashIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useState } from "react";

interface ImageUploadSectionProps {
  eventImage: File | null;
  setEventImage: (file: File | null) => void;
  imagePreview: string;
  setImagePreview: (preview: string) => void;
  itemVariants: any;
}

export const ImageUploadSection = ({
  eventImage,
  setEventImage,
  imagePreview,
  setImagePreview,
  itemVariants
}: ImageUploadSectionProps) => {
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("Image size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert("Please select an image file");
        return;
      }
      
      setEventImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center mb-4">
        <PhotoIcon className="h-5 w-5 text-blue-600 mr-2" />
        <h2 className="text-lg font-medium text-gray-900">Event Image</h2>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            {imagePreview ? (
              <div className="relative w-full h-full">
                <img
                  src={imagePreview}
                  alt="Event preview"
                  className="w-full h-full object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-lg">
                  <span className="text-white text-sm font-medium">Click to change image</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <PhotoIcon className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 5MB)</p>
              </div>
            )}
            <input
              id="image-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>
        </div>
        
        {eventImage && (
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">{eventImage.name}</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEventImage(null);
                setImagePreview("");
              }}
              className="text-red-600 hover:text-red-800"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}; 