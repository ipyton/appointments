"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

// GitHub OAuth App Configuration
// Using the secret as client ID - in production, you would register a GitHub OAuth App to get a proper client ID
const CLIENT_ID = 'Ov23licOT0M7CAklIRJa';
const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/github/callback` : '';

type UserRole = "User" | "ServiceProvider";

interface GithubLoginButtonProps {
  onError: (message: string) => void;
  className?: string;
  label?: string;
  defaultRole?: UserRole;
}

export default function GithubLoginButton({ 
  onError, 
  className = "", 
  label = "Sign in with GitHub",
  defaultRole = "User" 
}: GithubLoginButtonProps) {
  const { githubLogin } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [githubCode, setGithubCode] = useState<string | null>(null);
  
  // Check for the GitHub auth code in URL when the component mounts
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Store the code and show the role selection modal
      setGithubCode(code);
      setShowRoleModal(true);
      
      // Remove the code from the URL to prevent reuse
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  
  const completeLogin = async () => {
    try {
      setLoading(true);
      setShowRoleModal(false);
      
      if (!githubCode) {
        onError("Authentication failed. Please try again.");
        return;
      }
      
      // Use the GitHub code for validation with the selected role
      const result = await githubLogin(githubCode, selectedRole);
      
      if (!result.success) {
        onError(result.message || "Failed to log in with GitHub. Please try again.");
      }
      // Navigation is handled by AuthContext
    } catch (error) {
      onError("An unexpected error occurred during GitHub login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGithubLogin = () => {
    // Construct the GitHub OAuth authorization URL
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    
    // Redirect the user to GitHub's authorization page
    window.location.href = authUrl;
  };
  
  return (
    <>
      <button
        type="button"
        onClick={handleGithubLogin}
        disabled={loading}
        className={`flex items-center justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out h-10 ${className}`}
      >
        <div className="flex items-center justify-center w-full">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
          <span>{loading ? "Signing in..." : label}</span>
        </div>
      </button>
      
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