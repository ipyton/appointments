"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function UserDashboard() {
  const { user } = useAuth();

  const dashboardItems = [
    {
      title: "Browse Events",
      description: "Explore available events and book appointments.",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
      href: "/user/events",
      color: "blue"
    },
    {
      title: "My Calendar",
      description: "View your scheduled appointments in calendar format.",
      icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
      href: "/user/calendar",
      color: "green"
    },
    {
      title: "My Bookings",
      description: "Manage your current and past bookings.",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
      href: "/user/bookings",
      color: "purple"
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name}</h1>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
          User Account
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardItems.map((item) => (
          <Link key={item.title} href={item.href} className="group">
            <div className="h-full bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 group-hover:border-blue-200">
              <div className="p-6">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-${item.color}-50 text-${item.color}-600 group-hover:bg-${item.color}-100 transition-colors`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <h2 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-600">
                  {item.description}
                </p>
              </div>
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
                <span className="text-sm text-gray-500 group-hover:text-blue-600 transition-colors flex items-center">
                  View
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-2 text-blue-800">Quick Tips</h2>
        <ul className="list-disc list-inside text-blue-700 space-y-1 text-sm">
          <li>Browse available events and select a time slot that works for you</li>
          <li>Check your calendar to see all your upcoming appointments</li>
          <li>Manage or cancel your bookings from the My Bookings page</li>
        </ul>
      </div>
    </div>
  );
} 