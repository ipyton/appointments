"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { URL } from "../apis/URL";
import { useAuth } from "./AuthContext";
import Chat from "../apis/Chat";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

interface ChatContextType {
  messages: Message[];
  unreadCount: number;
  isChatOpen: boolean;
  isLoading: boolean;
  activeChat: string | null;
  toggleChat: () => void;
  sendMessage: (content: string, receiverId: string) => Promise<boolean>;
  loadMessages: (businessOwnerId: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  setActiveChat: (userId: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const { user } = useAuth();

  // Load unread message count on mount
  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      
      // Set up polling for new messages every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCount();
        if (activeChat) {
          loadMessages(activeChat);
        }
      }, 30000);
      
      return () => clearInterval(interval);
    }
  }, [user, activeChat]);

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
      // Use mock API for development
      const data = await Chat.getUnreadCount(user.token);
      setUnreadCount(data.count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  const sendMessage = async (content: string, receiverId: string): Promise<boolean> => {
    if (!user || !content.trim()) return false;
    
    setIsLoading(true);
    try {
      // Use mock API for development
      const data = await Chat.sendMessage(content, receiverId, user.token);
      setMessages(prev => [...prev, data]);
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (businessOwnerId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Use mock API for development
      const data = await Chat.getMessages(businessOwnerId, user.token);
      setMessages(data);
      setActiveChat(businessOwnerId);
      
      // Update unread count after loading messages
      fetchUnreadCount();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    if (!user) return;
    
    try {
      // Use mock API for development
      const success = await Chat.markAsRead(messageId, user.token);
      
      if (success) {
        // Update message in state
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
        
        // Update unread count
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <ChatContext.Provider 
      value={{ 
        messages, 
        unreadCount, 
        isChatOpen, 
        isLoading,
        activeChat,
        toggleChat, 
        sendMessage, 
        loadMessages, 
        markAsRead,
        setActiveChat
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
} 