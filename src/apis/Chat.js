import { URL } from "./URL";
import * as signalR from "@microsoft/signalr";

// SignalR connection instance
let connection = null;

/**
 * Initialize the SignalR connection
 * @param {string} token - Authentication token
 * @returns {signalR.HubConnection} - The SignalR connection
 */
const initializeSignalR = (token) => {
  if (connection && connection.state === signalR.HubConnectionState.Connected) {
    return connection;
  }
  
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`https://${URL.SIGNALR_URL}/chathub`, {
      accessTokenFactory: () => token
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

  return connection;
};

const Chat = {
  // Get newest messages info (not all messages content)
  getNewestMessagesInfo: async (token) => {
    try {
      const response = await fetch(`${URL.API_BASE}/chat/newest-messages`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch newest messages info:", error);
      throw error;
    }
  },

  // Get messages with pagination (10 messages per request)
  getMessages: async (senderId, receiverId, token, olderThanMessageId = null) => {
    try {
      let url = `${URL.API_BASE}/chat/messages?senderId=${senderId}&receiverId=${receiverId}`;
      if (olderThanMessageId) {
        url += `&olderThanMessageId=${olderThanMessageId}`;
      }
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const messages = await response.json();
      return messages;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      throw error;
    }
  },
  
  sendMessage: async (content, receiverId, token) => {
    try {
      const response = await fetch(`${URL.API_BASE}/chat/send`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiverId,
          content,
          timestamp: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },
  
  // Mark a message as read
  markAsRead: async (messageId, token) => {
    try {
      const response = await fetch(`${URL.API_BASE}/chat/read/${messageId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return true;
    } catch (error) {
      console.error("Failed to mark message as read:", error);
      return false;
    }
  },
  
  // Get unread message count for current user
  getUnreadCount: async (token) => {
    try {
      const response = await fetch(`${URL.API_BASE}/chat/unread/count`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to get unread count:", error);
      throw error;
    }
  },
  
  // Get all business owners (for user to select who to chat with)
  getBusinessOwners: async (token) => {
    try {
      const response = await fetch(`${URL.API_BASE}/chat/providers`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch business owners:", error);
      throw error;
    }
  },
  
  // Connect to SignalR for real-time messaging
  connectToSignalR: async (token, onMessageReceived, onConnectionStatusChange) => {
    try {
      const conn = initializeSignalR(token);
      
      // Register event handlers
      conn.on("ReceiveMessage", message => {
        if (onMessageReceived) onMessageReceived(message);
      });
      
      conn.onclose(() => {
        if (onConnectionStatusChange) onConnectionStatusChange('disconnected');
      });
      
      conn.onreconnecting(() => {
        if (onConnectionStatusChange) onConnectionStatusChange('reconnecting');
      });
      
      conn.onreconnected(() => {
        if (onConnectionStatusChange) onConnectionStatusChange('connected');
      });
      
      // Start the connection if it's not already started
      if (conn.state !== signalR.HubConnectionState.Connected) {
        await conn.start();
        if (onConnectionStatusChange) onConnectionStatusChange('connected');
      }
      
      // Return methods to manage the connection
      return {
        disconnect: async () => {
          if (conn && conn.state === signalR.HubConnectionState.Connected) {
            await conn.stop();
            if (onConnectionStatusChange) onConnectionStatusChange('disconnected');
          }
        }
      };
    } catch (error) {
      console.error("SignalR connection error:", error);
      if (onConnectionStatusChange) onConnectionStatusChange('error', error);
      throw error;
    }
  }
};

export default Chat; 