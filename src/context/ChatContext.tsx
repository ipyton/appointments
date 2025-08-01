"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  connectionStatus: string;
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
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const signalRConnection = useRef<{ disconnect: () => Promise<void> } | null>(null);
  const { user } = useAuth();

  // Initialize SignalR connection when user is authenticated
  useEffect(() => {
    if (!user) return;

    const initializeSignalR = async () => {
      try {
        // Clean up previous connection if exists
        if (signalRConnection.current) {
          await signalRConnection.current.disconnect();
        }

        // Set up SignalR connection with message handler
        const connection = await Chat.connectToSignalR(
          user.token,
          (message: Message) => {
            // Handle incoming message
            if (message.senderId === activeChat || message.receiverId === user.id) {
              setMessages(prev => [...prev, message]);
              // Update unread count if needed
              if (!message.isRead && message.receiverId === user.id) {
                setUnreadCount(prev => prev + 1);
              }
            }
          },
          (status: string, error?: Error) => {
            setConnectionStatus(status);
            if (error) {
              console.error("SignalR connection error:", error);
            }
          }
        );

        signalRConnection.current = connection;
      } catch (error) {
        console.error("Failed to initialize SignalR:", error);
        setConnectionStatus('error');
      }
    };

    initializeSignalR();
    fetchUnreadCount();
    
    return () => {
      // Clean up connection on unmount
      if (signalRConnection.current) {
        signalRConnection.current.disconnect().catch(err => {
          console.error("Error disconnecting SignalR:", err);
        });
      }
    };
  }, [user]);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChat && user) {
      loadMessages(activeChat);
    }
  }, [activeChat, user]);

  const fetchUnreadCount = async () => {
    if (!user) return;
    
    try {
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
      const data = await Chat.sendMessage(content, receiverId, user.token);
      // The message will be added to the UI automatically through SignalR
      // but we can also add it directly for immediate feedback
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
      const data = await Chat.getMessages(businessOwnerId, user.token);
      setMessages(data);
      setActiveChat(businessOwnerId);
      
      // Mark messages from this business owner as read
      const unreadMessages = data.filter(
        msg => !msg.isRead && msg.senderId === businessOwnerId
      );
      
      // Mark each unread message as read
      for (const msg of unreadMessages) {
        await markAsRead(msg.id);
      }
      
      // Update unread count after marking messages as read
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
        connectionStatus,
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