"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function ProviderDashboardPage() {
  const { user } = useAuth();

  // Mock statistics
  const stats = {
    totalAppointments: 24,
    pendingInvitations: 3,
    activeEvents: 8,
    totalRevenue: 1250.00,
    upcomingToday: 2,
    completionRate: 95
  };

  // Quick access cards
  const quickAccessCards = [
    {
      title: "Calendar",
      description: "View your appointment schedule",
      link: "/provider/calendar",
      color: "bg-blue-50 border-blue-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Invitations",
      description: "Manage appointment requests",
      link: "/provider/invitations",
      color: "bg-yellow-50 border-yellow-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: "Events",
      description: "Manage your available services",
      link: "/provider/events",
      color: "bg-green-50 border-green-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      title: "Create Event",
      description: "Add new appointment options",
      link: "/provider/create-event",
      color: "bg-purple-50 border-purple-500",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Provider Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
        <p className="opacity-90">
          You have {stats.pendingInvitations} pending appointment requests and {stats.upcomingToday} appointments scheduled for today.
        </p>
      </div>

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickAccessCards.map((card, index) => (
          <Link 
            key={index} 
            href={card.link}
            className={`block p-4 rounded-lg shadow border-l-4 ${card.color} hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center space-x-4">
              <div>
                {card.icon}
              </div>
              <div>
                <h3 className="font-medium">{card.title}</h3>
                <p className="text-sm text-gray-600">{card.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Appointments</h3>
          <p className="text-2xl font-bold">{stats.totalAppointments}</p>
          <div className="mt-2 text-xs text-green-600">
            +12% from last month
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Events</h3>
          <p className="text-2xl font-bold">{stats.activeEvents}</p>
          <div className="mt-2 text-xs text-blue-600">
            {stats.activeEvents} services available
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Revenue</h3>
          <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
          <div className="mt-2 text-xs text-green-600">
            +5% from last month
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="font-medium">Recent Activity</h2>
        </div>
        <div className="divide-y">
          <div className="p-4 flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">New appointment confirmed</p>
              <p className="text-sm text-gray-600">Jane Smith booked a Hair Cut for Oct 22, 2023</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="p-4 flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">Appointment request received</p>
              <p className="text-sm text-gray-600">Mike Johnson requested a Consultation</p>
              <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
            </div>
          </div>
          <div className="p-4 flex items-start">
            <div className="flex-shrink-0 mr-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
            <div>
              <p className="font-medium">Event updated</p>
              <p className="text-sm text-gray-600">You updated the details for "Massage Therapy"</p>
              <p className="text-xs text-gray-500 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
        <div className="p-3 bg-gray-50 text-center">
          <Link href="#" className="text-sm text-blue-600 hover:text-blue-800">
            View all activity
          </Link>
        </div>
      </div>
    </div>
  );
} 