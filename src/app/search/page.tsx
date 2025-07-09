"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/SearchBar';
import SearchAPI from '@/apis/Search';
import { useAuth } from '@/context/AuthContext';
import ServicePopup from '@/components/ServicePopup';
import UserProfilePopup from '@/components/UserProfilePopup';
import ProviderLayout from '@/app/provider/layout';
import UserLayout from '@/app/user/layout';

interface SearchResult {
  id: string;
  name: string;
  description: string;
  type: string;
  price: number | null;
  createdAt: string;
  image?: string;
  url?: string;
  email?: string;
  phone?: string;
  businessName?: string;
}

interface SearchResponse {
  totalCount: number;
  results: SearchResult[];
  facets: {
    type: {
      value: string;
      count: number;
    }[];
  };
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const typeParam = searchParams.get('type') || null;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'User' | 'Service'>(
    typeParam === 'User' || typeParam === 'Service' ? typeParam : 'all'
  );
  const { user } = useAuth();
  
  // States for popups
  const [selectedService, setSelectedService] = useState<SearchResult | null>(null);
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null);
  const [isServicePopupOpen, setIsServicePopupOpen] = useState(false);
  const [isUserProfilePopupOpen, setIsUserProfilePopupOpen] = useState(false);

  // Mock results as fallback if API fails
  const mockResults: SearchResult[] = []

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      
      // Fetch results from API
      const fetchSearchResults = async () => {
        try {
          const response = await SearchAPI.getSearchResults(
            query, 
            filter !== 'all' ? filter : null
          );
          
          if (response.ok) {
            const data = await response.json();
            console.log('Search API response:', data);
            // Extract results from the nested structure
            const searchData = data as SearchResponse;
            // Ensure data is an array
            setResults(Array.isArray(searchData.results) ? searchData.results : []);
          } else {
            console.error('Search API error:', response.status);
            // Fallback to filtered mock results on error
            const filtered = mockResults.filter(result => 
              result.name.toLowerCase().includes(query.toLowerCase()) ||
              result.description.toLowerCase().includes(query.toLowerCase())
            );
            setResults(filtered);
          }
        } catch (error) {
          console.error('Search error:', error);
          // Fallback to filtered mock results on error
          const filtered = mockResults.filter(result => 
            result.name.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filtered);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSearchResults();
    } else {
      setResults([]);
      setIsLoading(false);
    }
  }, [query, filter]);

  // Apply type filter (only needed for client-side filtering when using mock data)
  const filteredResults = filter === 'all' || results.every(result => result.type === filter)
    ? results 
    : results.filter(result => result.type === filter);

  // Ensure filteredResults is always an array
  const safeFilteredResults = Array.isArray(filteredResults) ? filteredResults : [];

  // Helper function to handle result click based on type and user role
  const handleResultClick = (result: SearchResult, event: React.MouseEvent) => {
    event.preventDefault(); // Prevent default navigation behavior

    if (result.type === 'Service') {
      // For services: show popup for providers, navigate to details for regular users
      if (user?.role === 'ServiceProvider') {
        setSelectedService(result);
        setIsServicePopupOpen(true);
      } else {
        // Regular user - navigate to service page
        window.location.href = `/user/events/${result.id}`;
      }
    } else if (result.type === 'User') {
      // For users: show popup for all user types
      setSelectedUser(result);
      setIsUserProfilePopupOpen(true);
    }
  };

  // The actual search results content
  const searchContent = (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Search meta info */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isLoading 
            ? 'Searching...' 
            : `Search Results for "${query}"`}
        </h1>
        {!isLoading && (
          <p className="text-gray-600 mt-2">
            Found {safeFilteredResults.length} {safeFilteredResults.length === 1 ? 'result' : 'results'}
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
          onClick={() => setFilter('User')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            filter === 'User' 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-white text-gray-700 hover:bg-gray-100'
          }`}
        >
          Users
        </button>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : safeFilteredResults.length === 0 ? (
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
          {safeFilteredResults.map((result) => (
            <div key={result.id} onClick={(e) => handleResultClick(result, e)} className="cursor-pointer">
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col h-full">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded overflow-hidden mr-4">
                    <Image
                      src={result.image || '/placeholder.jpg'}
                      alt={result.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{result.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      result.type === 'Service' ? 'bg-blue-100 text-blue-800' : 
                      result.type === 'User' ? 'bg-purple-100 text-purple-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 flex-grow">{result.description}</p>
                
                {/* Price and Date */}
                <div className="mt-3 space-y-1">
                  {result.price !== null && (
                    <div className="text-sm font-medium text-gray-900">
                      ${result.price.toFixed(2)}
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    {new Date(result.createdAt).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-blue-600 font-medium">View details →</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Popup for providers */}
      <ServicePopup 
        isOpen={isServicePopupOpen}
        onClose={() => setIsServicePopupOpen(false)}
        service={selectedService}
      />

      {/* User Profile Popup */}
      <UserProfilePopup 
        isOpen={isUserProfilePopupOpen}
        onClose={() => setIsUserProfilePopupOpen(false)}
        user={selectedUser}
      />
    </div>
  );

  // Return content within appropriate layout based on user role
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {searchContent}
        </div>
      </div>
    );
  }

  if (user.role === "ServiceProvider") {
    return <ProviderLayout>{searchContent}</ProviderLayout>;
  } else {
    return <UserLayout>{searchContent}</UserLayout>;
  }
}

export default function SearchResults() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}   