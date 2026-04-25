import { MessageCircle, X } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';

export function FloatingChatButton() {
  const { isOpen, hasUnread, toggleChat } = useChat();

  return (
    <button
      onClick={toggleChat}
      className="floating-chat-button"
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      aria-expanded={isOpen}
    >
      {isOpen ? (
        <X size={24} />
      ) : (
        <>
          <MessageCircle size={24} />
          {hasUnread && (
            <span className="chat-badge" aria-label="Unread messages">
              <span className="sr-only">Unread messages</span>
            </span>
          )}
        </>
      )}
    </button>
  );
}
