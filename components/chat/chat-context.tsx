import { ReactNode, createContext, useContext, useMemo, useState } from "react";

import { ChatInviteDialog, ChatRevokeInviteDialog } from "./chat-invite-dialog";
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
  create: () => void;
  revoke: (invite: Invite) => void;
};

export type ChatHandlers = {
  onSelectChat: (newChatSelection: Chat) => void;
  onCreateChat: (newChatName: string) => void;
  onCreateInvite: (chat: Chat, inviteEmail: string) => void;
  onRevokeInvite: (invite: Invite) => void;
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
  onRevokeInvite: (_invite) => {},
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
  const [inviteCreateDialog, setInviteCreateDialog] = useState({
    isOpen: false,
    open: () => setInviteCreateDialog((prev) => ({ ...prev, isOpen: true })),
    close: () => setInviteCreateDialog((prev) => ({ ...prev, isOpen: false })),
  });
  const [inviteRevokeDialog, setInviteRevokeDialog] = useState({
    isOpen: false,
    invite: null as Invite | null,
    open: (invite: Invite) =>
      setInviteRevokeDialog((prev) => ({ ...prev, isOpen: true, invite })),
    close: () =>
      setInviteRevokeDialog((prev) => ({
        ...prev,
        isOpen: false,
        invite: null,
      })),
  });

  const context = useMemo(
    () => ({
      ...value,
      sidebar,
      invite: {
        create: inviteCreateDialog.open,
        revoke: inviteRevokeDialog.open,
      },
    }),
    [value, sidebar, inviteCreateDialog, inviteRevokeDialog],
  );

  return (
    <ChatContext.Provider value={context}>
      <ChatInviteDialog
        open={inviteCreateDialog.isOpen}
        onClose={inviteCreateDialog.close}
      />
      {inviteRevokeDialog.invite !== null && (
        <ChatRevokeInviteDialog
          open={inviteRevokeDialog.isOpen}
          onClose={inviteRevokeDialog.close}
          invite={inviteRevokeDialog.invite}
        />
      )}
      <>{children}</>
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
