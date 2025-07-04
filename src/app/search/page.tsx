"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import Image from 'next/image';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'Provider' | 'Service';
  image: string;
  url: string;
}

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'Provider' | 'Service'>('all');

  // Mock search results - in a real app, these would come from an API call
  const mockResults: SearchResult[] = [
    {
      id: '1',
      title: 'Haircut and Styling',
      description: 'Professional haircut and styling service by expert stylists',
      type: 'Service',
      image: 'https://placehold.co/100x100?text=Haircut',
      url: '/user/events/haircut'
    },
    {
      id: '2',
      title: 'Beauty Salon Appointment',
      description: 'Book a session at our premium beauty salon',
      type: 'Service',
      image: 'https://placehold.co/100x100?text=Beauty',
      url: '/user/events/beauty-salon'
    },
    {
      id: '3',
      title: 'Massage Therapy',
      description: 'Relaxing massage therapy session with certified therapists',
      type: 'Service',
      image: 'https://placehold.co/100x100?text=Massage',
      url: '/user/events/massage'
    },
    {
      id: '4',
      title: 'StyleHub Salon',
      description: 'Premium hair styling and beauty treatments',
      type: 'Provider',
      image: 'https://placehold.co/100x100?text=StyleHub',
      url: '/provider/stylehub'
    },
    {
      id: '5',
      title: 'Financial Consultation',
      description: 'Expert financial planning and investment advice',
      type: 'Service',
      image: 'https://placehold.co/100x100?text=Finance',
      url: '/user/events/financial'
    },
    {
      id: '6',
      title: 'Yoga Class',
      description: 'Beginner to advanced yoga classes with experienced instructors',
      type: 'Service',
      image: 'https://placehold.co/100x100?text=Yoga',
      url: '/user/events/yoga'
    }
  ];

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      // Simulate API delay
      const timer = setTimeout(() => {
        // Filter mock results based on query
        const filtered = mockResults.filter(result => 
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query]);

  // Apply type filter
  const filteredResults = filter === 'all' 
    ? results 
    : results.filter(result => result.type === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with search bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center mb-6">
            <span className="text-xl font-bold text-blue-600">AppointEase</span>
          </Link>
          
          <SearchBar 
            placeholder="Search appointments, services, providers..." 
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search meta info */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLoading 
              ? 'Searching...' 
              : `Search Results for "${query}"`}
          </h1>
          {!isLoading && (
            <p className="text-gray-600 mt-2">
              Found {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('Provider')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'Provider' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Events
          </button>
          <button 
            onClick={() => setFilter('Service')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'Service' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Services
          </button>
          <button 
            onClick={() => setFilter('Provider')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'Provider' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Providers
          </button>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No results found</h2>
            <p className="text-gray-600">
              We couldn't find any matches for "{query}". Please try another search term.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map((result) => (
              <Link key={result.id} href={result.url} className="block">
                <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                      <Image
                        src={result.image}
                        alt={result.title}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">{result.title}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.type === 'Service' ? 'bg-blue-100 text-blue-800' : 
                        result.type === 'Provider' ? 'bg-purple-100 text-purple-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 flex-grow">{result.description}</p>
                  <div className="mt-4 text-sm text-blue-600 font-medium">View details →</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}   