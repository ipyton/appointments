"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";
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

interface NewestMessageInfo {
  userId: string;
  newMessageCount: number;
  latestMessage: {
    id: string;
    content: string;
    timestamp: string;
  };
}

interface ChatContextType {
  messages: Message[];
  unreadCount: number;
  isChatOpen: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  activeChat: string | null;
  connectionStatus: string;
  hasMoreMessages: boolean;
  newestMessagesInfo: NewestMessageInfo[];
  toggleChat: () => void;
  sendMessage: (content: string, receiverId: string) => Promise<boolean>;
  loadMessages: (receiverId: string) => Promise<void>;
  loadMoreMessages: () => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  setActiveChat: (userId: string | null) => void;
  refreshNewestMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// In-memory cache of messages
const messageCache: Record<string, Message[]> = {};

// Keep track of the oldest message ID per chat
const oldestMessageIds: Record<string, string> = {};

// Keep track if there are more messages to load
const chatHasMoreMessages: Record<string, boolean> = {};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [newestMessagesInfo, setNewestMessagesInfo] = useState<NewestMessageInfo[]>([]);
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
              // Update messages in UI
              setMessages(prev => [...prev, message]);
              
              // Cache the message
              const chatId = message.senderId === user.id ? message.receiverId : message.senderId;
              if (messageCache[chatId]) {
                messageCache[chatId] = [...messageCache[chatId], message];
              } else {
                messageCache[chatId] = [message];
              }
              
              // Update unread count if needed
              if (!message.isRead && message.receiverId === user.id) {
                setUnreadCount(prev => prev + 1);
                
                // Refresh newest messages info
                refreshNewestMessages();
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
    refreshNewestMessages();
    
    return () => {
      // Clean up connection on unmount
      if (signalRConnection.current) {
        signalRConnection.current.disconnect().catch(err => {
          console.error("Error disconnecting SignalR:", err);
        });
      }
    };
  }, [user, activeChat]);

  // Fetch the newest messages info
  const refreshNewestMessages = async () => {
    if (!user) return;
    
    try {
      const data = await Chat.getNewestMessagesInfo(user.token);
      setNewestMessagesInfo(data);
    } catch (error) {
      console.error("Error fetching newest messages info:", error);
    }
  };

  // Load cached messages when active chat changes
  useEffect(() => {
    if (activeChat && user) {
      // Check if we have cached messages
      if (messageCache[activeChat] && messageCache[activeChat].length > 0) {
        setMessages(messageCache[activeChat]);
        setHasMoreMessages(chatHasMoreMessages[activeChat] || false);
        
        // Mark cached unread messages as read
        markCachedMessagesAsRead(activeChat);
      } else {
        // No cached messages, load from API
        loadMessages(activeChat);
      }
    }
  }, [activeChat, user]);
  
  const markCachedMessagesAsRead = useCallback(async (chatId: string) => {
    if (!user || !messageCache[chatId]) return;
    
    const unreadMessages = messageCache[chatId].filter(
      (msg: Message) => !msg.isRead && msg.senderId === chatId
    );
    
    // Mark each unread message as read
    for (const msg of unreadMessages) {
      await markAsRead(msg.id);
    }
    
    // Update unread count after marking messages as read
    fetchUnreadCount();
    refreshNewestMessages();
  }, [user]);

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
      
      // Cache the message
      if (messageCache[receiverId]) {
        messageCache[receiverId] = [...messageCache[receiverId], data];
      } else {
        messageCache[receiverId] = [data];
      }
      
      // The message will be added to the UI automatically through SignalR
      // but we can also add it directly for immediate feedback
      setMessages(prev => [...prev, data]);
      
      // Update newest messages info
      await refreshNewestMessages();
      
      return true;
    } catch (error) {
      console.error("Error sending message:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (receiverId: string) => {
    if (!user) return;
    
    setIsLoading(true);
    setActiveChat(receiverId);
    
    try {
      // With the new API, we need to pass both senderId (current user) and receiverId
      const data = await Chat.getMessages(user.id, receiverId, user.token);
      
      // Update cache
      messageCache[receiverId] = data;
      
      // Store the oldest message ID if we got any messages
      if (data.length > 0) {
        oldestMessageIds[receiverId] = data[0].id;
        
        // If we got exactly 10 messages, assume there might be more
        chatHasMoreMessages[receiverId] = data.length === 10;
        setHasMoreMessages(data.length === 10);
      } else {
        chatHasMoreMessages[receiverId] = false;
        setHasMoreMessages(false);
      }
      
      setMessages(data);
      
      // Mark messages as read
      const unreadMessages = data.filter(
        (msg: Message) => !msg.isRead && msg.senderId === receiverId
      );
      
      // Mark each unread message as read
      for (const msg of unreadMessages) {
        await markAsRead(msg.id);
      }
      
      // Update unread count and newest messages info
      fetchUnreadCount();
      refreshNewestMessages();
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreMessages = async () => {
    if (!user || !activeChat || !hasMoreMessages || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      // Get the oldest message ID for the current chat
      const oldestMessageId = oldestMessageIds[activeChat];
      
      if (!oldestMessageId) {
        setIsLoadingMore(false);
        return;
      }
      
      // Load older messages - passing both sender and receiver IDs now
      const olderMessages = await Chat.getMessages(
        user.id,
        activeChat, 
        user.token, 
        oldestMessageId
      );
      
      // Update oldest message ID and hasMoreMessages flag
      if (olderMessages.length > 0) {
        oldestMessageIds[activeChat] = olderMessages[0].id;
        
        // If we got exactly 10 messages, there might be more
        chatHasMoreMessages[activeChat] = olderMessages.length === 10;
        setHasMoreMessages(olderMessages.length === 10);
      } else {
        chatHasMoreMessages[activeChat] = false;
        setHasMoreMessages(false);
      }
      
      // Update cache with older messages
      messageCache[activeChat] = [...olderMessages, ...messageCache[activeChat]];
      
      // Update UI
      setMessages(prev => [...olderMessages, ...prev]);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
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
        
        // Update message in cache
        if (activeChat && messageCache[activeChat]) {
          messageCache[activeChat] = messageCache[activeChat].map((msg: Message) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          );
        }
        
        // Update unread count and newest messages info
        fetchUnreadCount();
        refreshNewestMessages();
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
        isLoadingMore,
        activeChat,
        connectionStatus,
        hasMoreMessages,
        newestMessagesInfo,
        toggleChat, 
        sendMessage, 
        loadMessages,
        loadMoreMessages,
        markAsRead,
        setActiveChat,
        refreshNewestMessages
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