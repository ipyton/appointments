"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import GoogleLoginButton from '@/components/GoogleLoginButton';
import GithubLoginButton from '@/components/GithubLoginButton';

type UserRole = "User" | "ServiceProvider";

export default function Login() {
  const { login, isLoading, user, checkLoginStatus } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("User");
  
  // Check login status on page load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    
    try {
      // Use the updated login function that returns success status and error message
      const result = await login(email, password, rememberMe, selectedRole);
      
      if (!result.success) {
        setError(result.message || "Failed to log in. Please check your credentials.");
      }
      // No need to redirect here as AuthContext handles it
    } catch (error) {
      setError("An unexpected error occurred. Please try again later.");
    }
  };

  const handleGoogleError = (message: string) => {
    setError(message);
  };

  const handleGithubError = (message: string) => {
    setError(message);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left side - Brand/Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-10 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AppointEase</h1>
          <p className="text-blue-100 opacity-90">Simplifying scheduling for everyone</p>
        </div>
        
        <div className="relative h-64 my-8">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg transform -rotate-2"></div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg transform rotate-1"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Effortless Booking</h3>
              <p className="text-sm text-blue-100">Schedule and manage appointments with just a few clicks</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Simple and intuitive interface</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Secure and reliable booking system</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">24/7 access to your appointments</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600">AppointEase</h1>
            <p className="text-gray-500 mt-1">Sign in to continue</p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome back</h2>
            <p className="mt-3 text-gray-600 font-medium">
              New to AppointEase?{" "}
              <Link href="/register" className="font-bold text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
                Create an account
              </Link>
            </p>
          </div>
          
          <div className="mt-8">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-gray-800">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Account Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition duration-200 ease-in-out ${
                      selectedRole === "User"
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                    onClick={() => setSelectedRole("User")}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${selectedRole === "User" ? "bg-blue-100" : "bg-gray-100"}`}>
                      <svg className={`w-5 h-5 ${selectedRole === "User" ? "text-blue-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${selectedRole === "User" ? "text-blue-700" : "text-gray-800"}`}>Client</span>
                  </div>
                  
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition duration-200 ease-in-out ${
                      selectedRole === "ServiceProvider"
                        ? "bg-blue-50 border-blue-500 ring-2 ring-blue-500"
                        : "border-gray-300 hover:border-blue-500"
                    }`}
                    onClick={() => setSelectedRole("ServiceProvider")}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${selectedRole === "ServiceProvider" ? "bg-blue-100" : "bg-gray-100"}`}>
                      <svg className={`w-5 h-5 ${selectedRole === "ServiceProvider" ? "text-blue-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-medium ${selectedRole === "ServiceProvider" ? "text-blue-700" : "text-gray-800"}`}>Service Provider</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition duration-150 ease-in-out"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-800">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link href="/forgot-password" className="font-bold text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-10 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-600 font-medium">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <GoogleLoginButton onError={handleGoogleError} className="w-full" label="Sign in with Google" defaultRole={selectedRole} />
              <GithubLoginButton onError={handleGithubError} className="w-full" defaultRole={selectedRole} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 