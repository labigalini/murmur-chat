import { ReactNode, createContext, useContext, useMemo, useState } from "react";

import { Role } from "@/convex/roles";

import { Chat, Invite, Member, Message } from "./chat-types";

export type ChatState = {
  chatList: "loading" | Chat[];
  chat: "loading" | Chat | null;
  messages: "loading" | Message[];
  members: "loading" | Member[];
  viewer: "loading" | Member;
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

export type ChatHandlers = {
  onSelectChat: (newChatSelection: Chat) => void;
  onCreateChat: (newChatName: string) => void;
  onDeleteChat: (chat: Chat) => void;
  onChatNameChange: (chat: Chat, newName: string) => void;
  onChatAvatarChange: (chat: Chat, newAvatar: Blob) => void;
  onLifespanChange: (chat: Chat, newLifespan: number) => void;
  onCreateInvite: (chat: Chat, inviteEmail: string) => void;
  onRevokeInvite: (invite: Invite) => void;
  onChangeMemberRole: (member: Member, newRole: Role) => void;
  onRemoveMember: (invite: Member) => void;
  onSendMessage: (chat: Chat, newMessage: string) => void;
  onMessageRead?: (messageId: Message) => void;
};

export type ChatContextType = {
  state: ChatState;
} & ChatHandlers;

export const ChatContext = createContext({
  state: {} as ChatState,
  sidebar: {} as ChatSidebarState,
  onSelectChat: (_newChatSelection) => {},
  onCreateChat: (_newChatName) => {},
  onDeleteChat: (_chat) => {},
  onChatNameChange: (_chat, _newName) => {},
  onChatAvatarChange: (_chat, _newAvatar) => {},
  onLifespanChange: (_chat, _newLifespan) => {},
  onCreateInvite: (_chat, _inviteEmail) => {},
  onRevokeInvite: (_invite) => {},
  onChangeMemberRole: (_member: Member, _newRole: Role) => {},
  onRemoveMember: (_member) => {},
  onSendMessage: (_chat, _newMessage) => {},
} satisfies ChatContextType & {
  sidebar: ChatSidebarState;
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

  const context = useMemo(
    () => ({
      ...value,
      sidebar,
    }),
    [value, sidebar],
  );

  return (
    <ChatContext.Provider value={context}>
      <>{children}</>
    </ChatContext.Provider>
  );
};

export const useChatContext = () =>
  useContext(ChatContext) as ChatContextType & { sidebar: ChatSidebarState };
