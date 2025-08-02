"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Clock, MapPin, Star } from "lucide-react";
import Event from "@/apis/Event";
import { useAuth } from "@/context/AuthContext";

interface ServiceData {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  imageUrl?: string;
  provider: {
    id: string;
    fullName: string;
    businessName: string;
  };
}

export default function StarredServicesPage() {
  const [starredServices, setStarredServices] = useState<ServiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchStarredServices = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await Event.getStarredServices();
        
        if (!response.ok) {
          throw new Error("Failed to fetch starred services");
        }
        
        const data = await response.json();
        // Map backend response to expected frontend format if needed
        const formattedData = Array.isArray(data) ? data.map(service => ({
          id: service.id.toString(),
          name: service.name,
          description: service.description,
          price: service.price,
          duration: service.durationMinutes,
          imageUrl: service.imageUrl,
          provider: {
            id: service.provider?.id || "",
            fullName: service.provider?.fullName || "",
            businessName: service.provider?.businessName || ""
          }
        })) : [];
        
        setStarredServices(formattedData);
      } catch (error) {
        console.error("Error fetching starred services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStarredServices();
  }, [user, router]);

  const handleRemoveFromStarred = async (serviceId: string) => {
    try {
      const response = await Event.toggleStarService(serviceId);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove from starred");
      }
      
      setStarredServices(services => services.filter(service => service.id !== serviceId));
    } catch (error) {
      console.error("Error removing from starred:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Your Starred Services</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-pulse text-xl text-gray-500">Loading...</div>
        </div>
      ) : starredServices.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <Star size={48} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No starred services yet</h2>
          <p className="text-gray-500 mb-6">
            When you find services you're interested in, star them to save them here for easy access.
          </p>
          <button
            onClick={() => router.push('/user/events')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Browse Services
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {starredServices.map(service => (
            <div 
              key={service.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col"
            >
              <div className="relative h-48">
                <img 
                  src={service.imageUrl || "https://placebear.com/800/600"} 
                  alt={service.name} 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromStarred(service.id);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md text-yellow-500"
                >
                  <Star size={20} fill="currentColor" />
                </button>
              </div>
              <div className="p-4 flex-1">
                <h2 className="text-xl font-semibold mb-2">{service.name}</h2>
                <p className="text-gray-600 mb-4 truncate">
                  {service.provider.businessName || service.provider.fullName}
                </p>
                <div className="flex items-center text-gray-500 mb-2">
                  <Clock size={16} className="mr-2" />
                  <span>{service.duration} minutes</span>
                </div>
                <p className="font-bold text-lg text-blue-600 mt-4">${service.price}</p>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button
                  onClick={() => router.push(`/user/events/${service.id}`)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 