"use client";

import { useState, useEffect, useRef } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";

export default function ProviderChatPage() {
  const { user } = useAuth();
  const { messages, isLoading, activeChat, sendMessage, loadMessages } = useChat();
  const [users, setUsers] = useState<{id: string, name: string}[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Mock data for users
  const mockUsers = [
    { id: "user1", name: "John Doe" },
    { id: "user2", name: "Jane Smith" }
  ];

  useEffect(() => {
    // In a real app, fetch users who have chatted with this provider
    setUsers(mockUsers);
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectUser = (id: string) => {
    setSelectedUser(id);
    loadMessages(id);
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

  if (!user) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Customer Conversations</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User selection sidebar */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-medium text-lg mb-4">Customers</h2>
          {users.length === 0 ? (
            <p className="text-gray-500">No customers have messaged you yet</p>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedUser === u.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {u.name}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Chat messages */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col h-[600px]">
            {/* Chat header */}
            <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium">
                {selectedUser
                  ? users.find(u => u.id === selectedUser)?.name || "Chat"
                  : "Select a customer to chat with"}
              </h3>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {isLoading && messages.length === 0 ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-pulse text-gray-500">Loading...</div>
                </div>
              ) : !selectedUser ? (
                <div className="text-center text-gray-500 py-8">
                  Select a customer to view your conversation
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
                disabled={!selectedUser || isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 disabled:bg-blue-400"
                disabled={!messageText.trim() || !selectedUser || isLoading}
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