"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';
import SearchBar from './SearchBar';

export default function GlobalSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const openSearchDialog = () => {
    setIsOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when dialog is open
  };

  const closeSearchDialog = () => {
    setIsOpen(false);
    document.body.style.overflow = ''; // Restore scrolling
  };

  return (
    <>
      {/* Search button */}
      <button
        onClick={openSearchDialog}
        className="flex items-center justify-center h-8 w-8 rounded-full bg-black/5 hover:bg-black/10 transition-colors"
        aria-label="Search"
      >
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
      </button>

      {/* Search dialog overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl animate-slideDown">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-medium text-gray-800">Search</h2>
              <button 
                onClick={closeSearchDialog} 
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <SearchBar 
                placeholder="Search appointments, services, providers..." 
                className="w-full"
              />
              <p className="text-sm text-gray-500 mt-4">
                Press Enter to search or Escape to close
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 