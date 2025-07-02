"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { URL } from "../apis/URL";
import Auth from "../apis/Auth";
import { useRouter } from "next/navigation";

type UserRole = "User" | "ServiceProvider" | null;

interface AuthUser {
  id: string;
  fullName: string;
  businessName?: string;
  email: string;
  role: UserRole;
  token?: string;
  isServiceProvider?: boolean;
  avatar?: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; message?: string }>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  resetPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  checkLoginStatus: () => Promise<void>;
  updateProfile: (data: Partial<AuthUser>, avatarFile?: File | null) => Promise<{ success: boolean; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for stored user on initial load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Separate effect for navigation after user state is updated
  useEffect(() => {
    if (!isLoading && user) {
      if (user.isServiceProvider) {
        console.log("Navigating to provider dashboard");
        router.push("/provider");
      } else {
        console.log("Navigating to user dashboard");
        router.push("/user");
      }
    }
  }, [user, isLoading, router]);

  // Function to check login status and redirect if needed
  const checkLoginStatus = async () => {
    // setUser({role:"ServiceProvider", id: "1", name: "John Doe", email: "john.doe@example.com", avatar: null});
    setIsLoading(true);
    // return
    try {
      // Get token from localStorage
      const storedUser = localStorage.getItem("User");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Validate token with backend
        const response = await Auth.validateToken(parsedUser.token);
        
        if (response.ok) {
          // Token is valid, set user
          setUser(parsedUser);
          // Navigation is now handled in the separate useEffect
        } else {
          // Token is invalid, remove from localStorage
          localStorage.removeItem("User");
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      localStorage.removeItem("User");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // In a real app, these would make API calls to your backend
  const login = async (email: string, password: string, rememberMe: boolean = false) => {



    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      const response = await fetch(URL + "/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, Password: password, RememberMe: rememberMe }),
      });
      
      const data = await response.json();
      
      if (data.statusCode !== 200) {
        setIsLoading(false);
        return { 
          success: false, 
          message: data.message || "Login failed. Please check your credentials." 
        };
      }
      
      setUser(data);  
      localStorage.setItem("User", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      // Navigation is now handled in the separate useEffect
      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: "Network error. Please try again later." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(URL + "/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ FullName: name, Email: email, password: password, Role: role }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.statusCode !== 200) {
        return { 
          success: false, 
          message: data.message || "Registration failed. Please try again." 
        };
      }

      
      
      // setUser(data);
      // localStorage.setItem("User", JSON.stringify(data));
      
      // Navigation is now handled in the separate useEffect
      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { 
        success: false, 
        message: "Network error. Please try again later." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>, avatarFile?: File | null) => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to update your profile."
      };
    }

    setIsLoading(true);
    
    try {
      // In a real app, we would make an API call to update the profile
      // For now, we'll simulate a successful update
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For a real app, you would use FormData to handle file uploads
      // const formData = new FormData();
      // Object.entries(data).forEach(([key, value]) => {
      //   if (value !== undefined) {
      //     formData.append(key, value as string);
      //   }
      // });
      
      // if (avatarFile) {
      //   formData.append('avatar', avatarFile);
      // }
      
      // const response = await fetch(URL + "/account/update-profile", {
      //   method: "PUT",
      //   headers: {
      //     Authorization: `Bearer ${user.token}`,
      //   },
      //   body: formData,
      // });
      
      // const responseData = await response.json();
      
      // if (!response.ok) {
      //   throw new Error(responseData.message || "Failed to update profile");
      // }
      
      // Update the user state with the new data
      const updatedUser = {
        ...user,
        ...data,
        // In a real app, the avatar URL would come from the server response
        avatar: avatarFile ? window.URL.createObjectURL(avatarFile) : user.avatar,
      };
      
      setUser(updatedUser);
      localStorage.setItem("User", JSON.stringify(updatedUser));
      
      return { success: true };
    } catch (error) {
      console.error("Profile update failed:", error);
      return { 
        success: false, 
        message: "Failed to update profile. Please try again." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would send a password reset email
      const response = await fetch(URL + "/account/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email }),
      });
      
      const data = await response.json();
      
      if (!response.ok || data.statusCode !== 200) {
        return { 
          success: false, 
          message: data.message || "Password reset failed. Please try again." 
        };
      }
      
      return { success: true };
    } catch (error) {
      console.error("Password reset failed:", error);
      return { 
        success: false, 
        message: "Network error. Please try again later." 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch(URL + "/token/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Even if the server request fails, we should clear local state
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("User");
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, resetPassword, checkLoginStatus, updateProfile }}>
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