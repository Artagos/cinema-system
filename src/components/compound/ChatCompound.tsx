import { createContext, useContext, type ReactNode, useRef, useEffect, useState, useCallback } from 'react';
import { Send, Minimize2, User, Bot } from 'lucide-react';
import type { ChatMessage } from '../../types/chat';

// Context
interface ChatContextType {
  messages: ChatMessage[];
  onSend: (content: string) => void;
  onClose: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);

function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('Chat compound components must be used within ChatCompound');
  return context;
}

// Root Component
interface ChatCompoundProps {
  children: ReactNode;
  messages: ChatMessage[];
  onSend: (content: string) => void;
  onClose: () => void;
}

function ChatCompound({ children, messages, onSend, onClose }: ChatCompoundProps) {
  const [inputValue, setInputValue] = useState('');

  return (
    <ChatContext.Provider value={{ messages, onSend, onClose, inputValue, setInputValue }}>
      <div className="chat-panel" role="dialog" aria-label="Chat support">
        {children}
      </div>
    </ChatContext.Provider>
  );
}

// Header Component
function Header({ title = 'Support Chat', status = 'Online' }: { title?: string; status?: string }) {
  const { onClose } = useChatContext();

  return (
    <div className="chat-header">
      <div className="chat-header-info">
        <h3>{title}</h3>
        <span className="chat-status">
          <span className="status-dot online"></span>
          {status}
        </span>
      </div>
      <button onClick={onClose} className="chat-minimize-button" aria-label="Minimize chat">
        <Minimize2 size={18} />
      </button>
    </div>
  );
}

// Message List Component
function MessageList() {
  const { messages } = useChatContext();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const groups = groupMessagesByDate(messages);

  return (
    <div className="chat-messages" role="log" aria-live="polite" aria-label="Chat messages">
      {groups.map((group, idx) => (
        <div key={group.date + idx} className="message-group">
          <div className="date-separator"><span>{group.date}</span></div>
          {group.messages.map((msg) => (
            <ChatMessageItem key={msg.id} message={msg} />
          ))}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

// Individual Message Component
function ChatMessageItem({ message }: { message: ChatMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div className={`chat-message ${isUser ? 'user' : 'support'}`}>
      <div className="message-avatar">{isUser ? <User size={16} /> : <Bot size={16} />}</div>
      <div className="message-content-wrapper">
        <div className="message-bubble">
          <p className="message-text">{message.content}</p>
        </div>
        <span className="message-meta">
          {formatTime(message.timestamp)}
          {isUser && message.status === 'sending' && <span className="sending-indicator">Sending...</span>}
        </span>
      </div>
    </div>
  );
}

// Input Component
function Input({ placeholder = 'Type a message...' }: { placeholder?: string }) {
  const { onSend, inputValue, setInputValue } = useChatContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInputValue('');
  }, [inputValue, onSend, setInputValue]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-input-container">
      <div className="chat-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
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
  );
}

// Utilities
function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function groupMessagesByDate(messages: ChatMessage[]) {
  const groups: { date: string; messages: ChatMessage[] }[] = [];
  let current: { date: string; messages: ChatMessage[] } | null = null;

  for (const msg of messages) {
    const date = new Date(msg.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    if (!current || current.date !== date) {
      current = { date, messages: [] };
      groups.push(current);
    }
    current.messages.push(msg);
  }

  return groups;
}

// Attach sub-components
ChatCompound.Header = Header;
ChatCompound.MessageList = MessageList;
ChatCompound.Input = Input;

export { ChatCompound };
