"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Profile() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect due to the useEffect above
  }

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <div className="flex items-center gap-4">
            <Link 
              href="/home"
              className="text-blue-600 hover:text-blue-500"
            >
              Home
            </Link>
            <button 
              onClick={handleLogout}
              className="text-red-600 hover:text-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4 bg-white">
            
            {/* User Information */}
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Account Type</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="text-blue-600 hover:text-blue-500 text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Conditional Content Based on Role */}
            {user.role === "user" ? (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">My Appointments</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-center">You don&apos;t have any appointments yet.</p>
                  <div className="mt-4 text-center">
                    <Link
                      href="/appointments/book"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Book an Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">My Services</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-center">You haven&apos;t added any services yet.</p>
                  <div className="mt-4 text-center">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add a Service
                    </button>
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold mb-4 mt-8">Appointment Requests</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-500 text-center">You don&apos;t have any appointment requests.</p>
                </div>
              </div>
            )}
            
            {/* Settings Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3 flex justify-between items-center">
                    <span>Change Password</span>
                    <button className="text-blue-600 hover:text-blue-500">
                      Change
                    </button>
                  </li>
                  <li className="py-3 flex justify-between items-center">
                    <span>Notification Settings</span>
                    <button className="text-blue-600 hover:text-blue-500">
                      Manage
                    </button>
                  </li>
                  <li className="py-3 flex justify-between items-center">
                    <span>Delete Account</span>
                    <button className="text-red-600 hover:text-red-500">
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 