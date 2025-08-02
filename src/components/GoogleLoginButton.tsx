"use client";

import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

type UserRole = "User" | "ServiceProvider";

interface GoogleLoginButtonProps {
  onError: (message: string) => void;
  className?: string;
  label?: string;
  defaultRole?: UserRole;
}

export default function GoogleLoginButton({ 
  onError, 
  className = "", 
  label = "Sign in with Google",
  defaultRole = "User"
}: GoogleLoginButtonProps) {
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [credential, setCredential] = useState<string | null>(null);
  
  // Create a button that looks like our GitHub button but contains the hidden Google component
  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      if (!credentialResponse.credential) {
        onError("No ID token received from Google");
        return;
      }
      
      // Store the credential and show the role selection modal
      setCredential(credentialResponse.credential);
      setShowRoleModal(true);
    } catch (error) {
      onError("An unexpected error occurred during Google login. Please try again later.");
    }
  };

  const completeLogin = async () => {
    try {
      setLoading(true);
      setShowRoleModal(false);
      
      if (!credential) {
        onError("Authentication failed. Please try again.");
        return;
      }
      
      // Use the ID token for validation with the selected role
      const result = await googleLogin(credential, selectedRole);
      
      if (!result.success) {
        onError(result.message || "Failed to log in with Google. Please try again.");
      }
    } catch (error) {
      onError("An unexpected error occurred during Google login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    onError("Google login failed. Please try again.");
  };
  
  return (
    <>
      <div className={`relative w-full h-10 ${className}`}>
        {/* Custom styled button that looks like GitHub button */}
        <button
          type="button"
          disabled={loading}
          className="flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out h-10 w-full"
        >
          <div className="flex items-center justify-center w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span>{loading ? "Signing in..." : label}</span>
          </div>
        </button>
        
        {/* Hidden Google login component */}
        <div className="absolute opacity-0 top-0 left-0 w-full h-full">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            useOneTap={false}
            type="standard"
            size="large"
          />
        </div>
      </div>

      {/* Role selection modal */}
      <Transition appear show={showRoleModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setShowRoleModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Choose Account Type
                  </Dialog.Title>
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Please select how you want to use AppointEase:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition duration-200 ease-in-out ${
                          selectedRole === "User"
                            ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500"
                            : "border-gray-300 hover:border-indigo-500"
                        }`}
                        onClick={() => setSelectedRole("User")}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedRole === "User" ? "bg-indigo-100" : "bg-gray-100"}`}>
                          <svg className={`w-6 h-6 ${selectedRole === "User" ? "text-indigo-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className={`text-sm font-semibold ${selectedRole === "User" ? "text-indigo-700" : "text-gray-800"}`}>Client</span>
                      </div>
                      
                      <div
                        className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition duration-200 ease-in-out ${
                          selectedRole === "ServiceProvider"
                            ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500"
                            : "border-gray-300 hover:border-indigo-500"
                        }`}
                        onClick={() => setSelectedRole("ServiceProvider")}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${selectedRole === "ServiceProvider" ? "bg-indigo-100" : "bg-gray-100"}`}>
                          <svg className={`w-6 h-6 ${selectedRole === "ServiceProvider" ? "text-indigo-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                          </svg>
                        </div>
                        <span className={`text-sm font-semibold ${selectedRole === "ServiceProvider" ? "text-indigo-700" : "text-gray-800"}`}>Service Provider</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setShowRoleModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                      onClick={completeLogin}
                    >
                      Continue
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
} 