import { useState, useEffect } from "react";
import { X, Mail, Phone, Calendar } from "lucide-react";
import Image from "next/image";

interface User {
  id: string;
  name: string;
  description: string;
  image?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  createdAt: string;
}

interface UserProfilePopupProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function UserProfilePopup({ 
  isOpen, 
  onClose, 
  user 
}: UserProfilePopupProps) {
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

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out"
         style={{ opacity: isVisible ? 1 : 0 }}>
      <div className={`bg-white rounded-xl shadow-2xl max-w-xl w-full p-6 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-in-out ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}>
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-start mb-6">
          <div className="mr-4">
            <div className="h-24 w-24 rounded-full overflow-hidden relative bg-gray-100">
              <Image
                src={user.image || '/placeholder.jpg'}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          <div>
            <h3 className="font-medium text-lg text-gray-900">{user.name}</h3>
            {user.businessName && (
              <div className="text-blue-600 font-medium mb-1">{user.businessName}</div>
            )}
            
            {user.email && (
              <div className="flex items-center text-gray-600 text-sm my-1">
                <Mail className="h-4 w-4 mr-2" />
                <span>{user.email}</span>
              </div>
            )}
            
            {user.phone && (
              <div className="flex items-center text-gray-600 text-sm my-1">
                <Phone className="h-4 w-4 mr-2" />
                <span>{user.phone}</span>
              </div>
            )}
            
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
          <div className="prose prose-sm max-w-none">
            <p>{user.description}</p>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100 text-right">
          <button
            onClick={() => window.open(`/provider-profile/${user.id}`, '_blank')}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            View Full Profile
          </button>
        </div>
      </div>
    </div>
  );
} 