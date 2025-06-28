"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not logged in or not a user
    if (!user) {
      router.push("/login");
    } else if (user.role !== "user") {
      router.push("/home");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user || user.role !== "user") {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto_1fr] font-[family-name:var(--font-geist-sans)]">
      <header className="bg-white shadow p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/home">
              <Image
                className="dark:invert"
                src="/next.svg"
                alt="Appointments Logo"
                width={120}
                height={30}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user.name}</span>
            <Link 
              href="/profile"
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              My Profile
            </Link>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-500 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        <aside className="bg-gray-50 w-full md:w-64 p-4 md:min-h-screen">
          <nav className="space-y-2">
            <Link 
              href="/user/events" 
              className="block p-2 rounded hover:bg-gray-200 text-blue-600 font-medium"
            >
              Browse Events
            </Link>
            <Link 
              href="/user/calendar" 
              className="block p-2 rounded hover:bg-gray-200 text-blue-600 font-medium"
            >
              My Calendar
            </Link>
            <Link 
              href="/user/bookings" 
              className="block p-2 rounded hover:bg-gray-200 text-blue-600 font-medium"
            >
              My Bookings
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 