"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import SearchAPI from '@/apis/Search';

// Define interface for search suggestion items
interface SearchSuggestion {
  id: string;
  type: string;
  name: string;
  description: string;
  text?: string;
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

// Debounce function to limit how often a function can be called
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
}

export default function SearchBar({ placeholder = "Search...", className = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // Debounce the search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Handle clicks outside the search component to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter suggestions based on debounced input
  useEffect(() => {
    if (debouncedSearchQuery.length > 1) {
      setIsLoading(true);
      
      // Call the API to get the suggestions
      SearchAPI.getSuggestions(debouncedSearchQuery)
        .then(res => res.json())
        .then(data => {
          // Expecting an array of suggestion objects directly
          setSuggestions(data || []);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching suggestions:', error);
          setSuggestions([]);
          setIsLoading(false);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setSearchQuery(suggestion.name);
    router.push(`/search?q=${encodeURIComponent(suggestion.name)}&type=${suggestion.type}&id=${suggestion.id}`);
    setShowSuggestions(false);
  };

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="flex items-center">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 1);
            }}
            onFocus={() => setShowSuggestions(searchQuery.length > 1)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                      bg-white text-sm md:text-base"
            aria-label="Search"
          />
          <button
            type="submit"
            className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                      transition-colors font-medium text-sm"
          >
            Search
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && (debouncedSearchQuery.length > 1) && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading suggestions...</div>
          ) : suggestions.length > 0 ? (
            <ul>
              {suggestions.map((suggestion, index) => (
                <li 
                  key={suggestion.id || index} 
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <span className="font-medium">{suggestion.name}</span>
                      <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                        suggestion.type === 'Service' ? 'bg-green-100 text-green-800' :
                        suggestion.type === 'Event' ? 'bg-purple-100 text-purple-800' :
                        suggestion.type === 'Provider' ? 'bg-amber-100 text-amber-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {suggestion.type}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span className="mr-1">Type:</span>
                      <span className="font-medium">{suggestion.type}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {suggestion.description?.substring(0, 120)}
                      {suggestion.description?.length > 120 ? '...' : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-sm text-gray-500">No suggestions found</div>
          )}
        </div>
      )}
    </div>
  );
} 