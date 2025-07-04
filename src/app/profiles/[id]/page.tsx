"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

// Types for profile data
interface ProfileData {
  id: string;
  name: string;
  avatar: string;
  type: 'Provider' | 'Client';
  description: string;
  contactInfo?: {
    email?: string;
    phone?: string;
  };
  // Provider-specific fields
  services?: {
    id: string;
    title: string;
    description: string;
    price: string;
    duration: string;
  }[];
  // Additional fields that might be useful
  rating?: number;
  reviewCount?: number;
  location?: string;
}

export default function ProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would be an API call using the id
    setIsLoading(true);
    
    // Mock data - replace with actual API call
    setTimeout(() => {
      // This simulates fetching profile data based on the ID
      const mockProfiles: Record<string, ProfileData> = {
        '1': {
          id: '1',
          name: 'Haircut and Styling Service',
          avatar: 'https://placehold.co/200x200?text=Haircut',
          type: 'Provider',
          description: 'Professional haircut and styling service by expert stylists. We offer a range of styles and treatments for all hair types.',
          rating: 4.8,
          reviewCount: 245,
          location: 'New York, NY',
          contactInfo: {
            email: 'contact@haircutstyle.com',
            phone: '(123) 456-7890'
          },
          services: [
            {
              id: 's1',
              title: 'Basic Haircut',
              description: 'Simple haircut with wash and style',
              price: '$35',
              duration: '30 min'
            },
            {
              id: 's2',
              title: 'Premium Styling',
              description: 'Complete styling with treatment',
              price: '$75',
              duration: '60 min'
            }
          ]
        },
        '2': {
          id: '2',
          name: 'Beauty Salon Services',
          avatar: 'https://placehold.co/200x200?text=Beauty',
          type: 'Provider',
          description: 'Full-service beauty salon offering everything from facials to manicures and pedicures.',
          rating: 4.6,
          reviewCount: 189,
          location: 'Los Angeles, CA',
          contactInfo: {
            email: 'info@beautysalon.com',
            phone: '(234) 567-8901'
          }
        },
        '4': {
          id: '4',
          name: 'StyleHub Salon',
          avatar: 'https://placehold.co/200x200?text=StyleHub',
          type: 'Provider',
          description: 'Premium hair styling and beauty treatments for all occasions.',
          rating: 4.9,
          reviewCount: 312,
          location: 'Chicago, IL',
          contactInfo: {
            email: 'appointments@stylehub.com',
            phone: '(345) 678-9012'
          }
        },
        'user1': {
          id: 'user1',
          name: 'Jane Smith',
          avatar: 'https://placehold.co/200x200?text=Jane',
          type: 'Client',
          description: 'Regular client looking for quality services',
          location: 'Seattle, WA'
        }
      };

      setProfile(mockProfiles[id as string] || null);
      setIsLoading(false);
    }, 1000);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile Not Found</h2>
            <p className="text-gray-600 mb-4">
              The profile you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/search" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </Link>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
          <div className="p-6 sm:p-8 md:flex">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-100 mx-auto md:mx-0">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{profile.name}</h1>
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.type === 'Provider' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {profile.type}
                    </span>
                    {profile.location && (
                      <span className="ml-3 text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {profile.location}
                      </span>
                    )}
                  </div>
                </div>
                {profile.type === 'Provider' && profile.rating && (
                  <div className="bg-blue-50 rounded-lg p-3 inline-flex flex-col items-center">
                    <div className="flex items-center mb-1">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="ml-1 text-xl font-bold">{profile.rating}</span>
                    </div>
                    <span className="text-xs text-gray-600">{profile.reviewCount} reviews</span>
                  </div>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{profile.description}</p>
              
              {profile.contactInfo && (
                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                  {profile.contactInfo.email && (
                    <a href={`mailto:${profile.contactInfo.email}`} className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {profile.contactInfo.email}
                    </a>
                  )}
                  {profile.contactInfo.phone && (
                    <a href={`tel:${profile.contactInfo.phone}`} className="inline-flex items-center text-sm text-gray-700 hover:text-blue-600">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {profile.contactInfo.phone}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Services section for providers */}
        {profile.type === 'Provider' && profile.services && profile.services.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Services Offered</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.services.map(service => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{service.price}</span>
                    <span className="text-sm text-gray-500">{service.duration}</span>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors">
                    Book Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {profile.type === 'Provider' && (
            <Link href={`/user/events?provider=${profile.id}`} className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Book Appointment
            </Link>
          )}
          <Link href={`/chat?id=${profile.id}`} className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Message
          </Link>
        </div>
      </div>
    </div>
  );
} 