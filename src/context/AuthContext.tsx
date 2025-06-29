"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { URL } from "../apis/URL";

type UserRole = "user" | "provider" | null;

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // In a real app, these would make API calls to your backend
  const login = async (email: string, password: string) => {
    // This is a mock implementation
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    fetch(URL + "/account/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      setUser(data);  
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
    })

    // For demo, we'll create a fake user based on email
    // In a real app, this would validate credentials with your backend
    const mockUser: AuthUser = {
      id: "user-123",
      name: email.split('@')[0],
      email,
      role: email.includes("provider") ? "provider" : "user"
    };
    
    setUser(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    setIsLoading(false);
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    

    fetch(URL + "/account/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ FullName:name, Email:email, password:password, Role:role }),
    })
    .then(res => res.json())
    .then(data => {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setIsLoading(false);
    })
    .catch(error => {
      console.error("Registration failed:", error);
      setIsLoading(false);
    });
    setIsLoading(false);
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, this would send a password reset email
    // For demo purposes, we'll just simulate a successful request
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 