"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-700 font-medium">Loading...</p>
      </div>
    </div>
  );
}

// Form component that uses useSearchParams
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    // In a real app, you would validate the token here
    if (!token) {
      setError("Invalid or expired password reset link");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    
    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would make an API call to reset the password
      // using the token and new password
      
      setSuccessMessage("Your password has been reset successfully");
      setPassword("");
      setConfirmPassword("");
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (_) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-1">Create New Password</h3>
              <p className="text-sm text-blue-100">Choose a strong password for your account</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Create a new secure password</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Secure and private</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Instant access after reset</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-3xl font-bold text-blue-600">AppointEase</h1>
            <p className="text-gray-500 mt-1">Reset your password</p>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Create new password</h2>
            <p className="mt-3 text-gray-600 font-medium">
              Your new password must be different from previously used passwords.
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
            
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md animate-fade-in">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-700">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
                  New Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="••••••••"
                    disabled={!token || !!successMessage}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-800">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="••••••••"
                    disabled={!token || !!successMessage}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || !token || !!successMessage}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Resetting...
                    </span>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
            
            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
                ← Back to login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResetPasswordForm />
    </Suspense>
  );
} 