import { URL } from "./URL";

// Mock data for development
const mockUsers = [
  { id: "provider1", name: "Dr. Smith", role: "ServiceProvider" },
  { id: "provider2", name: "Dr. Johnson", role: "ServiceProvider" },
  { id: "user1", name: "John Doe", role: "User" },
  { id: "user2", name: "Jane Smith", role: "User" }
];

const mockMessages = [
  {
    id: "msg1",
    senderId: "user1",
    senderName: "John Doe",
    receiverId: "provider1",
    content: "Hello, I'd like to schedule an appointment.",
    timestamp: "2023-06-01T10:30:00Z",
    isRead: true
  },
  {
    id: "msg2",
    senderId: "provider1",
    senderName: "Dr. Smith",
    receiverId: "user1",
    content: "Hi John, I'd be happy to help. What time works for you?",
    timestamp: "2023-06-01T10:35:00Z",
    isRead: true
  },
  {
    id: "msg3",
    senderId: "user1",
    senderName: "John Doe",
    receiverId: "provider1",
    content: "Would tomorrow at 2 PM work?",
    timestamp: "2023-06-01T10:40:00Z",
    isRead: false
  }
];

// Helper to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const Chat = {
  // Get all messages between current user and a specific business owner
  getMessages: async (businessOwnerId, token) => {
    // In a real app, this would make an API call with the token
    await delay(500); // Simulate network delay
    
    // For demo purposes, we'll just filter the mock messages
    // In a real app, this would be handled by the backend
    const currentUserId = getCurrentUserId(token);
    
    return mockMessages.filter(msg => 
      (msg.senderId === currentUserId && msg.receiverId === businessOwnerId) ||
      (msg.senderId === businessOwnerId && msg.receiverId === currentUserId)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },
  
  // Send a new message
  sendMessage: async (content, receiverId, token) => {
    await delay(500); // Simulate network delay
    
    const currentUserId = getCurrentUserId(token);
    const currentUser = mockUsers.find(u => u.id === currentUserId);
    
    if (!currentUser) {
      throw new Error("User not found");
    }
    
    // Create a new message
    const newMessage = {
      id: `msg${mockMessages.length + 1}`,
      senderId: currentUserId,
      senderName: currentUser.name,
      receiverId,
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Add to mock messages
    mockMessages.push(newMessage);
    
    return newMessage;
  },
  
  // Mark a message as read
  markAsRead: async (messageId, token) => {
    await delay(300); // Simulate network delay
    
    const messageIndex = mockMessages.findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      mockMessages[messageIndex].isRead = true;
      return true;
    }
    return false;
  },
  
  // Get unread message count for current user
  getUnreadCount: async (token) => {
    await delay(300); // Simulate network delay
    
    const currentUserId = getCurrentUserId(token);
    
    const count = mockMessages.filter(msg => 
      msg.receiverId === currentUserId && !msg.isRead
    ).length;
    
    return { count };
  },
  
  // Get all business owners (for user to select who to chat with)
  getBusinessOwners: async (token) => {
    await delay(500); // Simulate network delay
    
    // Return only service providers
    return mockUsers
      .filter(user => user.role === "ServiceProvider")
      .map(({ id, name }) => ({ id, name }));
  }
};

// Helper function to extract user ID from token
// In a real app, this would be handled by the backend
function getCurrentUserId(token) {
  // For demo purposes, we'll just return a hardcoded user ID
  // In a real app, this would decode the JWT token
  return "user1";
}

export default Chat; 