"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import Chat from "@/apis/Chat";
import { useSearchParams } from "next/navigation";

interface BusinessOwner {
  id: string;
  name: string;
}

export default function ChatPage() {
  const { user } = useAuth();
  const { 
    messages, 
    isLoading, 
    isLoadingMore, 
    activeChat, 
    hasMoreMessages, 
    newestMessagesInfo,
    sendMessage, 
    loadMessages, 
    loadMoreMessages,
    refreshNewestMessages
  } = useChat();
  
  const [businessOwners, setBusinessOwners] = useState<BusinessOwner[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedBusinessOwner, setSelectedBusinessOwner] = useState("");
  const searchParams = useSearchParams();
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevMessagesLengthRef = useRef<number>(0);

  useEffect(() => {
    // Fetch business owners when component mounts
    if (user) {
      fetchBusinessOwners();
      refreshNewestMessages();
    }
  }, [user, refreshNewestMessages]);

  useEffect(() => {
    // Auto-select provider from URL parameter
    const providerId = searchParams.get('providerId');
    if (providerId && businessOwners.length > 0) {
      // Check if the providerId exists in our business owners list
      const providerExists = businessOwners.some(owner => owner.id === providerId);
      if (providerExists) {
        handleSelectBusinessOwner(providerId);
      }
    }
  }, [businessOwners, searchParams]);
  
  // Handle scroll to load more messages
  const handleScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || isLoadingMore || !hasMoreMessages) return;
    
    // If we're near the top of the messages container, load more messages
    if (container.scrollTop < 50) {
      loadMoreMessages();
    }
  }, [isLoadingMore, hasMoreMessages, loadMoreMessages]);
  
  // Add scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, [handleScroll]);
  
  // Keep scroll position when new older messages are loaded
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;
    
    // If messages length increased and we have previous messages (not first load)
    if (messages.length > prevMessagesLengthRef.current && prevMessagesLengthRef.current > 0) {
      // Calculate how many new messages were added
      const newMessagesCount = messages.length - prevMessagesLengthRef.current;
      
      // If we're loading older messages (not new incoming messages)
      if (isLoadingMore) {
        // Find the height of the new messages and adjust scroll position
        setTimeout(() => {
          // This keeps the user at the same position after loading older messages
          const firstVisibleMessage = document.querySelector('.message-item:nth-child(' + (newMessagesCount + 1) + ')');
          if (firstVisibleMessage) {
            container.scrollTop = firstVisibleMessage.getBoundingClientRect().top - container.getBoundingClientRect().top;
          }
        }, 0);
      } else {
        // If these are new incoming messages (not old loaded ones), scroll to bottom
        setTimeout(() => {
          container.scrollTop = container.scrollHeight;
        }, 0);
      }
    } else if (messages.length > 0 && prevMessagesLengthRef.current === 0) {
      // First load, scroll to bottom
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 0);
    }
    
    // Update previous messages length reference
    prevMessagesLengthRef.current = messages.length;
  }, [messages.length, isLoadingMore]);

  const fetchBusinessOwners = async () => {
    try {
      const data = await Chat.getBusinessOwners(user?.token);
      setBusinessOwners(data);
    } catch (error) {
      console.error("Error fetching business owners:", error);
    }
  };

  const handleSelectBusinessOwner = (id: string) => {
    setSelectedBusinessOwner(id);
    loadMessages(id);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;
    
    const success = await sendMessage(messageText, activeChat);
    if (success) {
      setMessageText("");
    }
  };

  // Get unread count for a specific business owner
  const getUnreadCount = (businessOwnerId: string) => {
    const info = newestMessagesInfo.find(item => item.userId === businessOwnerId);
    return info ? info.newMessageCount : 0;
  };
  
  // Get latest message preview for a specific business owner
  const getLatestMessagePreview = (businessOwnerId: string) => {
    const info = newestMessagesInfo.find(item => item.userId === businessOwnerId);
    return info?.latestMessage?.content || "";
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Chat with Business Owners</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Business owner selection */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-lg mb-4">Business Owners</h2>
          {businessOwners.length === 0 ? (
            <p className="text-gray-500">No business owners available</p>
          ) : (
            <div className="space-y-2">
              {businessOwners.map(owner => {
                const unreadCount = getUnreadCount(owner.id);
                const latestMessage = getLatestMessagePreview(owner.id);
                
                return (
                  <button
                    key={owner.id}
                    onClick={() => handleSelectBusinessOwner(owner.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      selectedBusinessOwner === owner.id
                        ? "bg-blue-100 text-blue-700"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{owner.name}</span>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    
                    {latestMessage && (
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {latestMessage.length > 30
                          ? `${latestMessage.substring(0, 30)}...`
                          : latestMessage
                        }
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Chat messages */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[500px]">
            {/* Chat header */}
            <div className="bg-blue-600 text-white px-4 py-3">
              <h3 className="font-medium">
                {selectedBusinessOwner
                  ? businessOwners.find(o => o.id === selectedBusinessOwner)?.name || "Chat"
                  : "Select a business owner"}
              </h3>
            </div>
            
            {/* Messages */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {/* Loading indicator for older messages */}
              {isLoadingMore && (
                <div className="text-center py-2">
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading older messages...</span>
                </div>
              )}
              
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse text-gray-500">Loading...</div>
                </div>
              ) : !selectedBusinessOwner ? (
                <div className="text-center text-gray-500 py-8">
                  Select a business owner to start chatting
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  No messages yet. Start a conversation!
                </div>
              ) : (
                messages.map((message) => {
                  const isOwnMessage = message.senderId === user.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex message-item ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] px-4 py-2 rounded-lg ${
                          isOwnMessage
                            ? "bg-blue-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        <div className="text-sm">{message.content}</div>
                        <div className={`text-xs mt-1 ${isOwnMessage ? "text-blue-100" : "text-gray-500"}`}>
                          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Message input */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                disabled={!selectedBusinessOwner || isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400"
                disabled={!messageText.trim() || !selectedBusinessOwner || isLoading}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 