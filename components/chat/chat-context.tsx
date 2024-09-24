import { ReactNode, createContext, useContext, useMemo, useState } from "react";

import { Chat, Member, Message } from "./chat-types";

export type ChatState = {
  chatList: "loading" | Chat[];
  chat: "loading" | Chat | null;
  messages: "loading" | Message[];
  members: "loading" | Member[];
  urlPrefix: string;
};

export type ChatSidebarState = {
  title: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  open: (title: ReactNode, content: ReactNode) => void;
  close: () => void;
};

export type ChatHandlers = {
  onSelectChat: (newChatSelection: Chat) => void;
  onCreateChat: (newChatName: string) => void;
  onSendMessage: (chat: Chat, newMessage: string) => void;
};

export type ChatContextType = { state: ChatState } & ChatHandlers;

export const ChatContext = createContext({
  state: {} as ChatState,
  sidebar: {} as ChatSidebarState,
  onSelectChat: (_newChatSelection) => {},
  onCreateChat: (_newChatName) => {},
  onSendMessage: (_chat, _newMessage) => {},
} satisfies ChatContextType & { sidebar: ChatSidebarState });

export const ChatProvider = ({
  value,
  children,
}: {
  value: ChatContextType;
  children: ReactNode;
}) => {
  const [sidebar, setSidebar] = useState<ChatSidebarState>({
    title: null,
    content: null,
    isOpen: false,
    open: (title, content) =>
      setSidebar((prev) => ({ ...prev, isOpen: true, title, content })),
    close: () =>
      setSidebar((prev) => ({
        ...prev,
        isOpen: false,
        title: null,
        content: null,
      })),
  });

  const context = useMemo(() => ({ ...value, sidebar }), [sidebar, value]);

  return (
    <ChatContext.Provider value={context}>
      <>{children}</>
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
