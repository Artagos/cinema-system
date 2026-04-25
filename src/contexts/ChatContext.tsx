import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { ChatMessage, ChatConversation, ChatContextType } from '../types/chat';

const ChatContext = createContext<ChatContextType | null>(null);

const STORAGE_KEY = 'cine_chat_conversation';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: generateId(),
    content: 'Hello! Welcome to CineManager. How can I help you today?',
    sender: 'support',
    timestamp: new Date().toISOString(),
    status: 'sent',
  };
}

function loadConversationFromStorage(): ChatConversation | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // Ignore storage errors
  }
  return null;
}

function saveConversationToStorage(conversation: ChatConversation): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversation));
  } catch {
    // Ignore storage errors
  }
}

function createNewConversation(): ChatConversation {
  return {
    id: generateId(),
    messages: [createWelcomeMessage()],
    isOpen: false,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversation, setConversation] = useState<ChatConversation>(() => {
    const stored = loadConversationFromStorage();
    return stored || createNewConversation();
  });

  // Persist to localStorage whenever conversation changes
  useEffect(() => {
    saveConversationToStorage(conversation);
  }, [conversation]);

  const sendMessage = useCallback((content: string) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      status: 'sending',
    };

    setConversation(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      updatedAt: new Date().toISOString(),
    }));

    // Simulate API call with optimistic UI
    setTimeout(() => {
      setConversation(prev => ({
        ...prev,
        messages: prev.messages.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        ),
      }));

      // Simulate support response
      setTimeout(() => {
        const responseMessage: ChatMessage = {
          id: generateId(),
          content: getAutoResponse(content),
          sender: 'support',
          timestamp: new Date().toISOString(),
          status: 'sent',
        };

        setConversation(prev => {
          const isChatOpen = prev.isOpen;
          return {
            ...prev,
            messages: [...prev.messages, responseMessage],
            unreadCount: isChatOpen ? 0 : prev.unreadCount + 1,
            updatedAt: new Date().toISOString(),
          };
        });
      }, 1000);
    }, 500);
  }, []);

  const toggleChat = useCallback(() => {
    setConversation(prev => ({
      ...prev,
      isOpen: !prev.isOpen,
      unreadCount: !prev.isOpen ? 0 : prev.unreadCount,
    }));
  }, []);

  const closeChat = useCallback(() => {
    setConversation(prev => ({
      ...prev,
      isOpen: false,
    }));
  }, []);

  const openChat = useCallback(() => {
    setConversation(prev => ({
      ...prev,
      isOpen: true,
      unreadCount: 0,
    }));
  }, []);

  const markAsRead = useCallback(() => {
    setConversation(prev => ({
      ...prev,
      unreadCount: 0,
    }));
  }, []);

  const value: ChatContextType = {
    conversation,
    isOpen: conversation.isOpen,
    hasUnread: conversation.unreadCount > 0,
    sendMessage,
    toggleChat,
    closeChat,
    openChat,
    markAsRead,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

// Simple auto-response based on keywords
function getAutoResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  
  if (lower.includes('movie') || lower.includes('film')) {
    return 'You can browse all our movies in the Movies section. You\'ll find details about showtimes, ratings, and availability there!';
  }
  if (lower.includes('ticket') || lower.includes('book')) {
    return 'To book tickets, please visit the Public Movies page where you can see all currently showing films and select your preferred showtime.';
  }
  if (lower.includes('login') || lower.includes('account')) {
    return 'If you\'re having trouble logging in, make sure you\'re using the correct email and password. Staff members can contact the administrator for account issues.';
  }
  if (lower.includes('help') || lower.includes('support')) {
    return 'I\'m here to help! You can ask me about movies, tickets, your account, or any other questions about CineManager.';
  }
  if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hello! How can I assist you today?';
  }
  
  return 'Thank you for your message. A member of our support team will review it shortly. Is there anything else I can help you with?';
}
