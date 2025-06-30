"use client";

import { useState, useEffect } from "react";
import { useChat } from "@/context/ChatContext";
import { useAuth } from "@/context/AuthContext";
import Chat from "@/apis/Chat";

export default function ChatPage() {
  const { user } = useAuth();
  const { messages, isLoading, activeChat, sendMessage, loadMessages } = useChat();
  const [businessOwners, setBusinessOwners] = useState<{id: string, name: string}[]>([]);
  const [messageText, setMessageText] = useState("");
  const [selectedBusinessOwner, setSelectedBusinessOwner] = useState("");

  useEffect(() => {
    // Fetch business owners when component mounts
    if (user) {
      fetchBusinessOwners();
    }
  }, [user]);

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
              {businessOwners.map(owner => (
                <button
                  key={owner.id}
                  onClick={() => handleSelectBusinessOwner(owner.id)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedBusinessOwner === owner.id
                      ? "bg-blue-100 text-blue-700"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {owner.name}
                </button>
              ))}
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
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
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