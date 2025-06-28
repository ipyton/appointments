"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  CalendarIcon, 
  InboxIcon, 
  DocumentDuplicateIcon, 
  PlusCircleIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon
} from "@heroicons/react/24/outline";

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
      color: "bg-blue-50 text-blue-700",
      icon: <CalendarIcon className="h-6 w-6" />
    },
    {
      title: "Invitations",
      description: "Manage appointment requests",
      link: "/provider/invitations",
      color: "bg-yellow-50 text-yellow-700",
      icon: <InboxIcon className="h-6 w-6" />
    },
    {
      title: "Events",
      description: "Manage your available services",
      link: "/provider/events",
      color: "bg-green-50 text-green-700",
      icon: <DocumentDuplicateIcon className="h-6 w-6" />
    },
    {
      title: "Create Event",
      description: "Add new appointment options",
      link: "/provider/create-event",
      color: "bg-purple-50 text-purple-700",
      icon: <PlusCircleIcon className="h-6 w-6" />
    }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Provider Dashboard</h1>
        <div className="text-sm text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Welcome Card */}
      <motion.div 
        variants={itemVariants}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 -mt-4 -mr-16 opacity-20">
          <CalendarIcon className="h-32 w-32" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Welcome back, {user?.name}!</h2>
        <p className="opacity-90 max-w-lg">
          You have {stats.pendingInvitations} pending appointment requests and {stats.upcomingToday} appointments scheduled for today.
        </p>
        <div className="mt-4 flex space-x-4">
          <Link href="/provider/invitations" className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            View Requests
            <ArrowUpIcon className="ml-1 h-4 w-4 rotate-45" />
          </Link>
          <Link href="/provider/calendar" className="inline-flex items-center px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-colors">
            Today's Schedule
            <ArrowUpIcon className="ml-1 h-4 w-4 rotate-45" />
          </Link>
        </div>
      </motion.div>

      {/* Quick Access Cards */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {quickAccessCards.map((card, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Link 
              href={card.link}
              className={`block p-5 rounded-xl shadow-sm hover:shadow-md transition-all ${card.color} border border-opacity-10`}
            >
              <div className="flex items-center space-x-4">
                <div className="bg-white p-2 rounded-lg shadow-sm">
                  {card.icon}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{card.title}</h3>
                  <p className="text-sm opacity-75">{card.description}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Appointments</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</h3>
            </div>
            <span className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <CalendarIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-green-600">
            <ArrowUpIcon className="h-3 w-3 mr-1" />
            <span>12% from last month</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Pending Invitations</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.pendingInvitations}</h3>
            </div>
            <span className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
              <InboxIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-yellow-600">
            <ClockIcon className="h-3 w-3 mr-1" />
            <span>Awaiting response</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Active Events</p>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeEvents}</h3>
            </div>
            <span className="bg-green-100 p-2 rounded-lg text-green-600">
              <DocumentDuplicateIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-blue-600">
            <CheckCircleIcon className="h-3 w-3 mr-1" />
            <span>{stats.activeEvents} services available</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
            <span className="bg-purple-100 p-2 rounded-lg text-purple-600">
              <CurrencyDollarIcon className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-2 flex items-center text-xs text-green-600">
            <ArrowUpIcon className="h-3 w-3 mr-1" />
            <span>5% from last month</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        variants={itemVariants}
        className="bg-white rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-medium text-lg">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-100">
          <div className="p-5 flex items-start hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">New appointment confirmed</p>
              <p className="text-sm text-gray-600">Jane Smith booked a Hair Cut for Oct 22, 2023</p>
              <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
            </div>
          </div>
          <div className="p-5 flex items-start hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Appointment request received</p>
              <p className="text-sm text-gray-600">Mike Johnson requested a Consultation</p>
              <p className="text-xs text-gray-500 mt-1">5 hours ago</p>
            </div>
          </div>
          <div className="p-5 flex items-start hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 mr-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <DocumentDuplicateIcon className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            <div>
              <p className="font-medium text-gray-900">Event updated</p>
              <p className="text-sm text-gray-600">You updated the details for "Massage Therapy"</p>
              <p className="text-xs text-gray-500 mt-1">Yesterday</p>
            </div>
          </div>
        </div>
        <div className="p-4 bg-gray-50 text-center">
          <Link href="#" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View all activity
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
} 