import { createContext, useContext } from "react";

import { Chat, Message } from "./chat-types";

export type ChatState = {
  chatList: "loading" | Chat[];
  chat: "loading" | Chat | null;
  messages: "loading" | Message[];
};

export type ChatHandlers = {
  onSelectChat: (newChatSelection: Chat) => void;
  onCreateChat: (newChatName: string) => void;
  onSendMessage: (chat: Chat, newMessage: string) => void;
};

export type ChatContextType = { state: ChatState } & ChatHandlers;

export const ChatContex = createContext({
  state: {} as ChatState,
  onSelectChat: (_newChatSelection) => {},
  onCreateChat: (_newChatName: string) => {},
  onSendMessage: (_chat: Chat, _newMessage: string) => {},
} satisfies ChatContextType);

export const ChatProvider = ChatContex.Provider;

export const useChatContext = () => useContext(ChatContex);
