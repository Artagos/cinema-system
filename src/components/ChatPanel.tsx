import { useRef, useEffect, useState, useCallback } from 'react';
import { Send, Minimize2, User, Bot } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import type { ChatMessage } from '../types/chat';

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let currentGroup: { date: string; messages: ChatMessage[] } | null = null;

  messages.forEach(message => {
    const date = new Date(message.timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });

    if (!currentGroup || currentGroup.date !== date) {
      currentGroup = { date, messages: [] };
      groups.push(currentGroup);
    }
    currentGroup.messages.push(message);
  });

  return groups;
}

function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'support'}`}>
      <div className="message-avatar">
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className="message-content-wrapper">
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
        </div>
        <span className="message-meta">
          {formatTime(message.timestamp)}
          {isUser && message.status === 'sending' && (
            <span className="sending-indicator">Sending...</span>
          )}
        </span>
      </div>
    </div>
  );
}

export function ChatPanel() {
  const { conversation, isOpen, sendMessage, closeChat } = useChat();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation.messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle Escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeChat();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeChat]);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    sendMessage(trimmed);
    setInputValue('');
  }, [inputValue, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  const messageGroups = groupMessagesByDate(conversation.messages);

  return (
    <div className="chat-panel" role="dialog" aria-label="Chat support">
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-info">
          <h3>Support Chat</h3>
          <span className="chat-status">
            <span className="status-dot online"></span>
            Online
          </span>
        </div>
        <button
          onClick={closeChat}
          className="chat-minimize-button"
          aria-label="Minimize chat"
        >
          <Minimize2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div
        ref={messagesContainerRef}
        className="chat-messages"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messageGroups.map((group, groupIndex) => (
          <div key={group.date + groupIndex} className="message-group">
            <div className="date-separator">
              <span>{group.date}</span>
            </div>
            {group.messages.map(message => (
              <ChatMessageItem key={message.id} message={message} />
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-container">
        <div className="chat-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="chat-input"
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="chat-send-button"
            aria-label="Send message"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="chat-hint">Press Enter to send, Escape to close</p>
      </div>
    </div>
  );
}
