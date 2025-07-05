"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Service from "@/apis/Service";
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

// Define Service and Provider types based on the API response
interface ServiceData {
  id: number;
  name: string;
  enabled: boolean;
  description: string;
  price: number;
  providerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  allowMultipleBookings: boolean;
  arrangements: any;
}

interface Provider {
  id: string;
  fullName: string;
  businessName: string;
  email: string;
}

interface ServiceWithProvider {
  service: ServiceData;
  id: string;
  fullName: string;
  businessName: string;
  email: string;
}

interface PaginatedResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  services: ServiceWithProvider[];
}

// Placeholder image URLs
const PLACEHOLDER_IMAGES = [
  "https://placebear.com/800/600",
  "https://placebear.com/801/600",
  "https://placebear.com/802/600",
  "https://placebear.com/803/600",
  "https://placebear.com/804/600",
];

const PLACEHOLDER_AVATARS = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
  "https://randomuser.me/api/portraits/women/24.jpg",
  "https://randomuser.me/api/portraits/men/12.jpg",
];

export default function EventsPage() {
  const [services, setServices] = useState<ServiceWithProvider[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allServices, setAllServices] = useState<ServiceWithProvider[]>([]);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Load services from API
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await Service.getServicesByPage(currentPage);
        const data: PaginatedResponse = await response.json();
        
        console.log("API Response:", data);
        
        if (data && data.services) {
          if (currentPage === 1) {
            setAllServices(data.services);
          } else {
            setAllServices(prev => [...prev, ...data.services]);
          }
          setServices(data.services);
          setTotalPages(data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    
    fetchServices();
  }, [currentPage]);
  
  // Load more services when scrolling
  const loadMoreServices = () => {
    if (currentPage < totalPages && !loadingMore) {
      setLoadingMore(true);
      setCurrentPage(prev => prev + 1);
    }
  };
  
  // Filter services based on search
  const filteredServices = allServices.filter(serviceItem => {
    const service = serviceItem.service;
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        serviceItem.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        serviceItem.businessName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Get random placeholder image
  const getRandomImage = (id: number) => {
    return PLACEHOLDER_IMAGES[id % PLACEHOLDER_IMAGES.length];
  };

  // Get random avatar
  const getRandomAvatar = (id: number) => {
    return PLACEHOLDER_AVATARS[id % PLACEHOLDER_AVATARS.length];
  };

  // Row renderer for List
  const Row = ({ index, style }: { index: number, style: React.CSSProperties }) => {
    if (index >= filteredServices.length) {
      return <div style={style}></div>;
    }
    
    const serviceItem = filteredServices[index];
    const service = serviceItem.service;
    
    return (
      <div style={{
        ...style,
        padding: '10px'
      }}>
        <Link href={`/user/events/${service.id}`} className="group">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col transform group-hover:-translate-y-1">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={getRandomImage(service.id)} 
                alt={service.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-5 flex-grow">
              <h2 className="text-xl font-semibold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors">{service.name}</h2>
              <p className="text-gray-700 mb-4 line-clamp-3">{service.description}</p>
              
              {/* Provider with avatar */}
              <div className="flex items-center mb-3 bg-white p-3 rounded-lg border border-gray-200">
                <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3 ring-2 ring-gray-200">
                  <img 
                    src={getRandomAvatar(service.id)} 
                    alt={serviceItem.fullName}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{serviceItem.fullName}</div>
                  <div className="text-xs text-gray-600">{serviceItem.businessName}</div>
                </div>
              </div>
            </div>
            <div className="px-5 py-4 bg-white border-t border-gray-200 flex justify-between items-center">
              <span className="font-semibold text-blue-600">${service.price.toFixed(2)}</span>
              <span className="text-sm text-white px-3 py-1.5 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors flex items-center shadow-sm">
                Book Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Available Services</h1>
      

      
      {loading && currentPage === 1 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-14 h-14 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
          <p className="mt-4 text-gray-700">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-amber-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-xl font-medium text-amber-900 mb-2">No services found</h3>
          <p className="text-amber-800 text-lg">No services match your search criteria. Try adjusting your filters.</p>
          <button 
            onClick={() => { setSearchTerm(''); }}
            className="mt-4 px-4 py-2 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 transition-colors font-medium flex items-center mx-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M3.146 8.354a.5.5 0 01.708 0l3 3a.5.5 0 01-.708.708l-3-3a.5.5 0 010-.708z" clipRule="evenodd" />
            </svg>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="h-[800px] w-full">
          <AutoSizer>
            {({ height, width }) => (
              <List
                height={height}
                itemCount={filteredServices.length}
                itemSize={450}
                width={width}
              >
                {Row}
              </List>
            )}
          </AutoSizer>
        </div>
      )}
      
      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center my-6">
          <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-blue-600 animate-spin"></div>
        </div>
      )}
      
      {/* Load more button */}
      {!loading && currentPage < totalPages && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMoreServices}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center"
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading...' : 'Load More Services'}
          </button>
        </div>
      )}
      
      <div className="mt-10 bg-blue-50 rounded-xl p-6 border border-blue-100 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Service Booking Help
        </h2>
        <p className="text-blue-800 mb-2">
          Browse through our available services and click on any service card to see more details and available time slots.
        </p>
        <p className="text-blue-800">
          You can search for specific services using the search box above.
        </p>
      </div>
    </div>
  );
} 