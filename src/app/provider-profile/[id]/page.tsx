"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Service {
  id: string;
  name: string;
  price: number;
  duration?: string;
  description?: string;
}

interface ProviderDetails {
  id: string;
  name: string;
  businessName: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  rating?: number;
  reviewCount?: number;
  services: Service[];
  contactInfo?: {
    email?: string;
    phone?: string;
    website?: string;
  };
}

export default function ProviderProfilePage() {
  const params = useParams();
  const providerId = params.id as string;
  
  const [provider, setProvider] = useState<ProviderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Mock API function to fetch provider data
  const fetchProviderDetails = async (id: string): Promise<ProviderDetails> => {
    // In a real app, this would be an API call
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // Mock data based on provider ID
    const providers: Record<string, ProviderDetails> = {
      'stylehub': {
        id: 'stylehub',
        name: 'Sarah Johnson',
        businessName: 'StyleHub Salon',
        avatar: 'https://placehold.co/200x200?text=SJ',
        coverImage: 'https://placehold.co/1200x300?text=StyleHub+Salon',
        bio: 'StyleHub Salon offers premium hair styling and beauty treatments with over 10 years of experience in the industry.',
        location: '123 Beauty Street, Fashion District',
        rating: 4.8,
        reviewCount: 124,
        services: [
          { id: '101', name: 'Haircut & Styling', price: 75, duration: '45 min', description: 'Professional haircut and styling by expert stylists' },
          { id: '102', name: 'Hair Coloring', price: 120, duration: '90 min', description: 'Full hair coloring service with premium products' },
          { id: '103', name: 'Hair Treatment', price: 95, duration: '60 min', description: 'Rejuvenating hair treatment for damaged hair' },
        ],
        contactInfo: {
          email: 'contact@stylehub.example',
          phone: '(555) 123-4567',
          website: 'www.stylehub.example'
        }
      },
      'wellness': {
        id: 'wellness',
        name: 'Michael Chen',
        businessName: 'Wellness Retreat Center',
        avatar: 'https://placehold.co/200x200?text=MC',
        coverImage: 'https://placehold.co/1200x300?text=Wellness+Retreat+Center',
        bio: 'Wellness Retreat Center is dedicated to providing holistic wellness services to help you achieve balance in body and mind.',
        location: '456 Serenity Avenue, Calm District',
        rating: 4.9,
        reviewCount: 89,
        services: [
          { id: '201', name: 'Full Body Massage', price: 90, duration: '60 min', description: 'Relaxing full body massage to release tension' },
          { id: '202', name: 'Yoga Session', price: 45, duration: '45 min', description: 'Guided yoga session for all experience levels' },
          { id: '203', name: 'Meditation Class', price: 35, duration: '30 min', description: 'Guided meditation to reduce stress and improve focus' },
        ],
        contactInfo: {
          email: 'info@wellness.example',
          phone: '(555) 987-6543',
          website: 'www.wellness.example'
        }
      }
    };
    
    const providerData = providers[id];
    if (!providerData) {
      throw new Error('Provider not found');
    }
    
    return providerData;
  };
  
  useEffect(() => {
    const getProviderDetails = async () => {
      try {
        setLoading(true);
        const data = await fetchProviderDetails(providerId);
        setProvider(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching provider details:', err);
        setError('Failed to load provider details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    getProviderDetails();
  }, [providerId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Provider Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'We could not find the provider you were looking for.'}
          </p>
          <Link href="/search" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
            Back to Search
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with navigation */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-blue-600">AppointEase</span>
            </Link>
            <Link href="/search" className="text-sm text-gray-600 hover:text-blue-600 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Search
            </Link>
          </div>
        </div>
      </div>
      
      {/* Cover Image */}
      <div className="relative h-64 bg-gray-200">
        {provider.coverImage && (
          <Image 
            src={provider.coverImage} 
            alt={provider.businessName}
            className="w-full h-full object-cover"
            width={1200}
            height={300}
          />
        )}
      </div>
      
      {/* Provider Profile Info */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            {/* Avatar */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 md:mb-0 md:mr-6 flex-shrink-0">
              <Image
                src={provider.avatar}
                alt={provider.name}
                width={128}
                height={128}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Provider Info */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-1">{provider.businessName}</h1>
              <p className="text-xl text-gray-600 mb-2">Owned by {provider.name}</p>
              
              {/* Rating and Location */}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-3 text-sm text-gray-600">
                {provider.rating && (
                  <div className="flex items-center">
                    <div className="flex items-center mr-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-4 h-4 ${i < Math.round(provider.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    {provider.rating} ({provider.reviewCount} reviews)
                  </div>
                )}
                
                {provider.location && (
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {provider.location}
                  </div>
                )}
              </div>
              
              {/* Contact Info */}
              {provider.contactInfo && (
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
                  {provider.contactInfo.email && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {provider.contactInfo.email}
                    </div>
                  )}
                  
                  {provider.contactInfo.phone && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {provider.contactInfo.phone}
                    </div>
                  )}
                  
                  {provider.contactInfo.website && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      {provider.contactInfo.website}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Book Button */}
            <div className="mt-4 md:mt-0 md:ml-4">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                Book Appointment
              </button>
            </div>
          </div>
          
          {/* Bio */}
          {provider.bio && (
            <div className="mt-6 border-t border-gray-100 pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">About</h2>
              <p className="text-gray-600">{provider.bio}</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Services Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Services Offered</h2>
          
          <div className="divide-y divide-gray-100">
            {provider.services.map((service) => (
              <div key={service.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between">
                <div className="flex-grow mb-3 md:mb-0">
                  <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600 mt-1">{service.description}</p>
                  )}
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    {service.duration && (
                      <span className="flex items-center mr-4">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {service.duration}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="text-xl font-semibold text-gray-900 mr-4">${service.price}</div>
                  <button className="px-4 py-2 bg-blue-100 text-blue-600 hover:bg-blue-200 font-medium rounded-lg transition-colors text-sm">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 