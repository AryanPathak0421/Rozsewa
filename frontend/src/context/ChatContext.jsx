import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  
  // Store all messages globally: { [bookingId]: [{ id, senderId, senderName, text, timestamp }] }
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("rozsewa_chat_messages");
    return saved ? JSON.parse(saved) : {};
  });

  // Track unread counts per booking for the current user
  const [unreadCounts, setUnreadCounts] = useState(() => {
    const saved = localStorage.getItem("rozsewa_chat_unread");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("rozsewa_chat_messages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("rozsewa_chat_unread", JSON.stringify(unreadCounts));
  }, [unreadCounts]);

  // Read messages for a specific booking
  const getMessages = (bookingId) => {
    return messages[bookingId] || [];
  };

  // Send a new message
  const sendMessage = (bookingId, text, receiverId) => {
    if (!user) return;
    
    const newMessage = {
      id: Date.now().toString(),
      senderId: user.id || "current-user",
      senderName: user.name || "User",
      text,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [bookingId]: [...(prev[bookingId] || []), newMessage]
    }));

    // Increment unread for the receiver (simulated locally)
    setUnreadCounts(prev => ({
      ...prev,
      [`${receiverId}_${bookingId}`]: (prev[`${receiverId}_${bookingId}`] || 0) + 1
    }));
  };

  // Mark all messages in a booking as read for the current user
  const markAsRead = (bookingId) => {
    if (!user) return;
    
    // Clear unread count for current user
    setUnreadCounts(prev => ({
      ...prev,
      [`${user.id || "current-user"}_${bookingId}`]: 0
    }));

    // Mark messages as read in the messages array
    setMessages(prev => {
      const chat = prev[bookingId];
      if (!chat) return prev;
      
      const updatedChat = chat.map(msg => 
        msg.senderId !== (user.id || "current-user") ? { ...msg, read: true } : msg
      );
      
      return { ...prev, [bookingId]: updatedChat };
    });
  };

  // Get total unread across all chats
  const getTotalUnread = () => {
    if (!user) return 0;
    const prefix = `${user.id || "current-user"}_`;
    return Object.entries(unreadCounts)
      .filter(([key]) => key.startsWith(prefix))
      .reduce((sum, [, count]) => sum + count, 0);
  };

  const value = {
    messages,
    getMessages,
    sendMessage,
    markAsRead,
    getTotalUnread,
    unreadCounts
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
