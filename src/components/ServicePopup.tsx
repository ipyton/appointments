import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number | null;
  image?: string;
  createdAt: string;
}

interface ServicePopupProps {
  isOpen: boolean;
  onClose: () => void;
  service: Service | null;
}

export default function ServicePopup({ 
  isOpen, 
  onClose, 
  service 
}: ServicePopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  // Animation control
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger animation
      setTimeout(() => setIsVisible(true), 50);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">{service.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="mb-6">
          {service.image && (
            <div className="mb-4 rounded-lg overflow-hidden h-48 w-full relative">
              <Image
                src={service.image}
                alt={service.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="prose prose-sm max-w-none">
            <p>{service.description}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          {service.price !== null && (
            <div className="text-lg font-semibold text-blue-600">
              ${service.price.toFixed(2)}
            </div>
          )}
          <div className="text-sm text-gray-500">
            Created: {new Date(service.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
} 