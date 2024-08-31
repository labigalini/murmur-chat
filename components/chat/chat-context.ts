import { createContext, useContext } from "react";

export type ChatState = {
  selectedChat: string;
};

export type ChatHandlers = {
  onCreateChat: (newChat: string) => void;
  onSendMessage: (newMessage: string) => void;
};

export const ChatContex = createContext({
  state: {} as ChatState,
  onCreateChat: (_newChat: string) => {},
  onSendMessage: (_newMessage: string) => {},
} satisfies { state: ChatState } & ChatHandlers);

export const ChatProvider = ChatContex.Provider;

export const useChatContext = () => useContext(ChatContex);
