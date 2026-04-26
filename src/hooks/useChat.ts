import { useChatContext } from '../contexts/ChatContext';
import type { ChatContextType } from '../types/chat';

export function useChat(): ChatContextType {
  return useChatContext();
}
