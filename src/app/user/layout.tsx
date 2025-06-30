"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ChatBox from "@/components/ChatBox";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Redirect if not logged in or not a user
    if (!user) {
      router.push("/login");
    } else if (user.role !== "User") {
      
      router.push("/home");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user || user.role !== "User") {
    return null; // Don't render anything while redirecting
  }

  const navItems = [
    { href: "/user/events", label: "Browse Events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { href: "/user/calendar", label: "My Calendar", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" },
    { href: "/user/bookings", label: "My Bookings", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
    { href: "/user/chat", label: "Chat", icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/home" className="flex-shrink-0 transition-transform hover:scale-105">
                <Image
                  className="h-8 w-auto"
                  src="/next.svg"
                  alt="Appointments Logo"
                  width={120}
                  height={30}
                  priority
                />
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600">Welcome,</span>
                <span className="font-medium text-blue-700">{user.name}</span>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <Link 
                href="/profile"
                className="text-gray-600 hover:text-blue-600 transition-colors px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-50"
              >
                Profile
              </Link>
              <button 
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium hover:bg-red-50"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu, show/hide based on menu state */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 pt-2 pb-3 space-y-1 shadow-lg">
            <div className="px-4 py-2 flex items-center">
              <span className="text-sm text-gray-600">Welcome, <span className="font-medium text-blue-700">{user.name}</span></span>
            </div>
            <Link 
              href="/profile"
              className="block px-4 py-2 text-base font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50"
            >
              Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-base font-medium text-gray-600 hover:text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <aside className="w-full md:w-64 md:flex-shrink-0 mb-6 md:mb-0">
          <div className="bg-white shadow-md rounded-xl overflow-hidden sticky top-20">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-5 sm:px-6">
              <h3 className="text-lg font-medium text-white">Navigation</h3>
            </div>
            <nav className="px-3 py-4 space-y-1">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="mr-3 h-5 w-5 text-gray-500 group-hover:text-blue-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1 md:ml-8">
          <div className="bg-white shadow-md rounded-xl p-6">
            {children}
          </div>
        </main>
      </div>
      
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">© {new Date().getFullYear()} Appointments. All rights reserved.</p>
        </div>
      </footer>

      {/* Chat Box Component */}
      <ChatBox />
    </div>
  );
} 