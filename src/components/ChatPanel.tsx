import { useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { ChatCompound } from './compound/ChatCompound';

/**
 * ChatPanel - Refactored with Compound Component Pattern
 *
 * Uses ChatCompound for declarative structure:
 * - Header: Title and status display
 * - MessageList: Grouped messages with auto-scroll
 * - Input: Message input with keyboard handling
 *
 * Escape key handling remains at container level
 */
export function ChatPanel() {
  const { conversation, isOpen, sendMessage, closeChat } = useChat();

  // Handle Escape key to close chat
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) closeChat();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeChat]);

  if (!isOpen) return null;

  return (
    <ChatCompound messages={conversation.messages} onSend={sendMessage} onClose={closeChat}>
      <ChatCompound.Header title="Support Chat" status="Online" />
      <ChatCompound.MessageList />
      <ChatCompound.Input placeholder="Type a message..." />
    </ChatCompound>
  );
}
