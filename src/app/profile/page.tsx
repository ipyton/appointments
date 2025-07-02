"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { UserCircleIcon, PencilIcon, CheckIcon, XMarkIcon, CameraIcon } from "@heroicons/react/24/outline";

export default function Profile() {
  const { user, logout, isLoading, updateProfile } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State for profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editError, setEditError] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    } else if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      // Set avatar URL from user object if available
      setAvatarUrl(user.avatar || null);
    }
  }, [user, isLoading, router]);

  // Handle avatar upload
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setEditError("Image size must be less than 5MB");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setEditError("Please select an image file");
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setEditError("");
    }
  };

  // Handle profile edit
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setName(user?.name || "");
      setEmail(user?.email || "");
      setAvatarUrl(user?.avatar || null); // Reset to original avatar
      setAvatarFile(null);
    }
    setIsEditing(!isEditing);
    setEditSuccess(false);
    setEditError("");
  };

  const handleSaveProfile = async () => {
    setIsUploading(true);
    setEditError("");
    
    try {
      // Update profile using the AuthContext function
      const result = await updateProfile({
        name,
        email,
      }, avatarFile);
      
      if (!result.success) {
        setEditError(result.message || "Failed to update profile");
        return;
      }
      
      setEditSuccess(true);
      setIsEditing(false);
      
    } catch (error) {
      console.error("Failed to update profile:", error);
      setEditError("Failed to update profile. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

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
          <div className="border border-gray-200 rounded-xl shadow-sm p-6 bg-white">
            
            {/* Profile Header with Avatar */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start mb-8 gap-6">
              {/* Avatar */}
              <div className="relative">
                    <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-lg">
      {avatarUrl ? (
        <Image 
          src={avatarUrl} 
          alt="Profile avatar" 
          width={128} 
          height={128}
          className="h-full w-full object-cover"
          unoptimized
        />
      ) : (
        <UserCircleIcon className="h-full w-full text-gray-300" />
      )}
    </div>
                
                {/* Edit avatar button */}
                {isEditing && (
                  <button 
                    onClick={handleAvatarClick}
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full shadow-md hover:bg-blue-700 transition-colors"
                    aria-label="Change avatar"
                  >
                    <CameraIcon className="h-5 w-5" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                  </button>
                )}
              </div>
              
              {/* User info */}
              <div className="flex-1">
                <div className="text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500">{user.email}</p>
                  <p className="mt-1 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full capitalize">
                    {user.role}
                  </p>
                </div>
                
                {/* Edit profile button */}
                <div className="mt-4 flex justify-center sm:justify-start">
                  {!isEditing ? (
                    <button 
                      onClick={handleEditToggle}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isUploading}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <CheckIcon className="h-4 w-4 mr-2" />
                        Save Changes
                      </button>
                      <button 
                        onClick={handleEditToggle}
                        disabled={isUploading}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                      >
                        <XMarkIcon className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Success/Error messages */}
                {editSuccess && (
                  <div className="mt-3 p-2 bg-green-50 text-green-800 text-sm rounded-md">
                    Profile updated successfully!
                  </div>
                )}
                
                {editError && (
                  <div className="mt-3 p-2 bg-red-50 text-red-800 text-sm rounded-md">
                    {editError}
                  </div>
                )}
              </div>
            </div>
            
            {/* User Information Form */}
            <div className="mb-8 p-6 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold mb-6">Profile Information</h3>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Your name"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{user.email}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Type
                    </label>
                    <p className="text-gray-900 font-medium capitalize">{user.role}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Account Status
                    </label>
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conditional Content Based on Role */}
            {user.role === "User" ? (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">My Appointments</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-500 text-center">You don&apos;t have any appointments yet.</p>
                  <div className="mt-4 text-center">
                    <Link
                      href="/user/bookings"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Book an Appointment
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">My Services</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-500 text-center">You haven&apos;t added any services yet.</p>
                  <div className="mt-4 text-center">
                    <Link
                      href="/provider/create-event"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Add a Service
                    </Link>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold mb-4 mt-8">Appointment Requests</h3>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-500 text-center">You don&apos;t have any appointment requests.</p>
                </div>
              </div>
            )}
            
            {/* Settings Section */}
            <div>
              <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500">Update your password regularly for security</p>
                    </div>
                    <Link href="/reset-password" className="text-blue-600 hover:text-blue-500 font-medium">
                      Change
                    </Link>
                  </li>
                  <li className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Notification Settings</h4>
                      <p className="text-sm text-gray-500">Manage how you receive notifications</p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-500 font-medium">
                      Manage
                    </button>
                  </li>
                  <li className="py-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-gray-900">Delete Account</h4>
                      <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                    </div>
                    <button className="text-red-600 hover:text-red-500 font-medium">
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