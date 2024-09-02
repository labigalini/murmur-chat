import { createContext, useContext } from "react";
import { Chat, Message } from "./chat-types";

export type ChatState = {
  chats: Chat[];
  selectedChat: Chat & { messages: Message[] };
  isMobile: boolean;
};

export type ChatHandlers = {
  onSelectChat: (newSelection: Chat) => void;
  onCreateChat: (newChat: string) => void;
  onSendMessage: (newMessage: string) => void;
};

export type ChatContextType = { state: ChatState } & ChatHandlers;

export const ChatContex = createContext({
  state: {} as ChatState,
  onSelectChat: (_newSelection) => {},
  onCreateChat: (_newChat: string) => {},
  onSendMessage: (_newMessage: string) => {},
} satisfies ChatContextType);

export const ChatProvider = ChatContex.Provider;

export const useChatContext = () => useContext(ChatContex);
