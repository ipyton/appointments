"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import { URL } from "@/apis/URL";
import Chat from "@/apis/Chat";
import { ChatBubbleLeftRightIcon, XMarkIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

export default function ChatBox() {
  const { 
    messages, 
    unreadCount, 
    isChatOpen, 
    isLoading, 
    activeChat,
    connectionStatus,
    toggleChat, 
    sendMessage, 
    loadMessages, 
    markAsRead 
  } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState("");
  const [businessOwners, setBusinessOwners] = useState<{id: string, name: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Fetch business owners when component mounts
  useEffect(() => {
    if (user && user.role === "User") {
      fetchBusinessOwners();
    }
  }, [user]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mark unread messages as read when chat is opened
  useEffect(() => {
    if (isChatOpen && messages.length > 0) {
      messages.forEach(msg => {
        if (!msg.isRead && msg.receiverId === user?.id) {
          markAsRead(msg.id);
        }
      });
    }
  }, [isChatOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchBusinessOwners = async () => {
    try {
      const data = await Chat.getBusinessOwners(user?.token);
      setBusinessOwners(data);
      
      // If there's only one business owner, set it as active chat
      if (data.length === 1) {
        loadMessages(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching business owners:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;
    
    const success = await sendMessage(messageText, activeChat);
    if (success) {
      setMessageText("");
      scrollToBottom();
    }
  };

  const handleSelectBusinessOwner = (id: string) => {
    loadMessages(id);
  };

  if (!user) return null;

  return (
    <>
      {/* Chat button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors z-10 flex items-center"
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Chat box */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-6 w-80 sm:w-96 bg-white rounded-lg shadow-xl z-10 flex flex-col max-h-[500px] border border-gray-200">
          {/* Chat header */}
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium">Chat</h3>
              <ConnectionStatus status={connectionStatus} />
            </div>
            <button onClick={toggleChat} className="text-white hover:text-gray-200">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Business owner selection (for users only) */}
          {user.role === "User" && businessOwners.length > 0 && (
            <div className="p-2 border-b border-gray-200">
              <select
                className="w-full p-2 border border-gray-300 rounded"
                onChange={(e) => handleSelectBusinessOwner(e.target.value)}
                value={activeChat || ""}
              >
                <option value="" disabled>Select a business owner</option>
                {businessOwners.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {isLoading && messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-pulse text-gray-500">Loading...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {activeChat ? "No messages yet. Start a conversation!" : "Select a business owner to start chatting"}
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.senderId === user.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
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
                        {!isOwnMessage && message.isRead && <span className="ml-1">✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 flex">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={!activeChat || isLoading || connectionStatus !== 'connected'}
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400"
              disabled={!messageText.trim() || !activeChat || isLoading || connectionStatus !== 'connected'}
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

// Connection status indicator component
function ConnectionStatus({ status }: { status: string }) {
  let color = "";
  let title = "";
  
  switch(status) {
    case 'connected':
      color = "bg-green-500";
      title = "Connected";
      break;
    case 'disconnected':
      color = "bg-red-500";
      title = "Disconnected";
      break;
    case 'reconnecting':
      color = "bg-yellow-500";
      title = "Reconnecting";
      break;
    case 'error':
      color = "bg-red-500";
      title = "Connection Error";
      break;
    default:
      color = "bg-gray-500";
      title = "Unknown Status";
  }
  
  return (
    <div className="flex items-center" title={title}>
      <div className={`h-2 w-2 rounded-full ${color}`}></div>
    </div>
  );
} 