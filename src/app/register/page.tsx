"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Register() {
  const { register, isLoading, user } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [role, setRole] = useState<"user" | "provider">("user");
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/home");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if(!terms){
      setError("Please agree to the terms and conditions");
      return;
    }
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      console.log({name, email, password, role})
      register(name, email, password, role).then(()=>{
        router.push("/login");

      })
    } catch (_) {
      setError("Failed to register. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-stretch">
      {/* Left side - Brand/Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-800 text-white p-10 flex-col justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">AppointEase</h1>
          <p className="text-indigo-100 opacity-90">Your scheduling solution</p>
        </div>
        
        <div className="relative h-64 my-8">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg transform rotate-2"></div>
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-lg transform -rotate-1"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-4">
                {role === "user" ? (
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <h3 className="text-xl font-semibold mb-1">
                {role === "user" ? "Client Account" : "Service Provider"}
              </h3>
              <p className="text-sm text-indigo-100">
                {role === "user" 
                  ? "Book services with your favorite providers" 
                  : "Manage your business and appointments"}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Free account creation</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Secure and private</p>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-indigo-200" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm">Instant access after registration</p>
          </div>
        </div>
      </div>
      
      {/* Right side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 md:p-20 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-10">
            <h1 className="text-3xl font-bold text-indigo-600">AppointEase</h1>
            <p className="text-gray-500 mt-1">Create your account</p>
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Start your journey</h2>
            <p className="mt-3 text-gray-600 font-medium">
              Already have an account?{" "}
              <Link href="/login" className="font-bold text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                Sign in
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
              {/* User Role Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  I am registering as a:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition duration-200 ease-in-out ${
                      role === "user"
                        ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500"
                        : "border-gray-300 hover:border-indigo-500"
                    }`}
                    onClick={() => setRole("user")}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${role === "user" ? "bg-indigo-100" : "bg-gray-100"}`}>
                      <svg className={`w-6 h-6 ${role === "user" ? "text-indigo-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className={`text-sm font-semibold ${role === "user" ? "text-indigo-700" : "text-gray-800"}`}>Client</span>
                  </div>
                  
                  <div
                    className={`flex flex-col items-center justify-center p-4 border rounded-md cursor-pointer transition duration-200 ease-in-out ${
                      role === "provider"
                        ? "bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500"
                        : "border-gray-300 hover:border-indigo-500"
                    }`}
                    onClick={() => setRole("provider")}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${role === "provider" ? "bg-indigo-100" : "bg-gray-100"}`}>
                      <svg className={`w-6 h-6 ${role === "provider" ? "text-indigo-600" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                        <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                      </svg>
                    </div>
                    <span className={`text-sm font-semibold ${role === "provider" ? "text-indigo-700" : "text-gray-800"}`}>Service Provider</span>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-800">
                  Full Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
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
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
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
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
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
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out sm:text-sm text-gray-900"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-150 ease-in-out"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-800">
                  I agree to the{" "}
                  <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-bold text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition duration-150 ease-in-out transform hover:-translate-y-0.5"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 