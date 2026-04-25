export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'support';
  timestamp: string;
  status: 'sending' | 'sent' | 'error';
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  isOpen: boolean;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChatContextType {
  conversation: ChatConversation;
  isOpen: boolean;
  hasUnread: boolean;
  sendMessage: (content: string) => void;
  toggleChat: () => void;
  closeChat: () => void;
  openChat: () => void;
  markAsRead: () => void;
}
