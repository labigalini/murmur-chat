import { ReactNode, createContext, useContext, useMemo, useState } from "react";

import { ChatInviteDialog } from "./chat-invite-dialog";
import { Chat, Invite, Member, Message } from "./chat-types";

export type ChatState = {
  chatList: "loading" | Chat[];
  chat: "loading" | Chat | null;
  messages: "loading" | Message[];
  members: "loading" | Member[];
  invites: "loading" | Invite[];
  urlPrefix: string;
};

export type ChatSidebarState = {
  title: ReactNode;
  content: ReactNode;
  isOpen: boolean;
  open: (title: ReactNode, content: ReactNode) => void;
  close: () => void;
};

export type ChatInviteState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export type ChatHandlers = {
  onSelectChat: (newChatSelection: Chat) => void;
  onCreateChat: (newChatName: string) => void;
  onCreateInvite: (chat: Chat, inviteEmail: string) => void;
  onSendMessage: (chat: Chat, newMessage: string) => void;
};

export type ChatContextType = { state: ChatState } & ChatHandlers;

export const ChatContext = createContext({
  state: {} as ChatState,
  sidebar: {} as ChatSidebarState,
  invite: {} as ChatInviteState,
  onSelectChat: (_newChatSelection) => {},
  onCreateChat: (_newChatName) => {},
  onCreateInvite: (_chat, _inviteEmail) => {},
  onSendMessage: (_chat, _newMessage) => {},
} satisfies ChatContextType & {
  sidebar: ChatSidebarState;
  invite: ChatInviteState;
});

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
      setSidebar((prev) => ({
        ...prev,
        isOpen: true,
        title,
        content,
      })),
    close: () =>
      setSidebar((prev) => ({
        ...prev,
        isOpen: false,
        title: null,
        content: null,
      })),
  });
  const [invite, setInvite] = useState<ChatInviteState>({
    isOpen: false,
    open: () => setInvite((prev) => ({ ...prev, isOpen: true })),
    close: () => setInvite((prev) => ({ ...prev, isOpen: false })),
  });

  const context = useMemo(
    () => ({
      ...value,
      sidebar,
      invite,
    }),
    [value, sidebar, invite],
  );

  return (
    <ChatContext.Provider value={context}>
      <ChatInviteDialog
        open={invite.isOpen}
        onOpenChange={(open) => (open ? invite.open() : invite.close())}
      />
      <>{children}</>
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
