"use client";

import { useCallback, useEffect, useState } from "react";

import { useAction, useMutation } from "convex/react";

import { ChatContainer } from "@/components/chat/chat-container";
import { Chat, Invite, Member, Message } from "@/components/chat/chat-types";

import { api } from "@/convex/_generated/api";
import { Role } from "@/convex/roles";

import { useStorage } from "@/hooks/useStorage";

import { skipIfUnset } from "@/lib/utils";

import {
  HistoryStateProvider,
  useHistoryState,
} from "@/app/_context/HistoryStateProvider";

import { useEncryption, useQuery } from "@/hooks";

type ChatBoardProps = {
  selectedChatId?: string;
};

export default function ChatBoard(props: ChatBoardProps) {
  return (
    <HistoryStateProvider>
      <ChatContainerWrapper {...props} />
    </HistoryStateProvider>
  );
}

function ChatContainerWrapper({
  selectedChatId: initialSelectedChatId,
}: ChatBoardProps) {
  const { upload } = useStorage();
  const encryption = useEncryption();
  const { pushState } = useHistoryState();

  const createChat = useMutation(api.chats.create);
  const deleteChat = useMutation(api.chats.remove);
  const patchChat = useMutation(api.chats.patch);
  const createInvite = useAction(api.invites.send);
  const revokeInvite = useMutation(api.invites.revoke);
  const updateMember = useMutation(api.members.update);
  const removeMember = useMutation(api.members.remove);
  const sendMessage = useMutation(api.messages.create);
  const markRead = useMutation(api.messages.markRead);

  const chats = useQuery(api.chats.list);
  const [selectedChat, setSelectedChat] = useState<"loading" | Chat | null>(
    "loading",
  );
  const selectedChatMembers = useQuery(
    api.members.list,
    skipIfUnset(selectedChat, (c) => ({ chatId: c._id })),
  );
  const selectedChatInvites = useQuery(
    api.invites.listByChat,
    skipIfUnset(selectedChat, (c) => ({ chatId: c._id })),
  );
  const selectedChatMessages = useQuery(
    api.messages.list,
    skipIfUnset(selectedChat, (c) => ({ chatId: c._id })),
  );
  const [decryptedMessages, setDecryptedMessages] =
    useState<typeof selectedChatMessages>("loading");

  // decrypt messages
  useEffect(() => {
    const decryptMessages = async () => {
      if (
        encryption === "loading" ||
        !selectedChatMessages ||
        selectedChatMessages === "loading"
      ) {
        setDecryptedMessages("loading");
        return;
      }

      const { decrypt } = encryption;

      const decrypted = await Promise.all(
        selectedChatMessages.map(async (original) => {
          return {
            ...original,
            text: await decrypt(original.text),
          };
        }),
      );

      setDecryptedMessages(decrypted);
    };

    decryptMessages().catch(console.error);
  }, [encryption, selectedChatMessages]);

  const handleSelectChat = useCallback(
    (newSelection: Chat) => {
      pushState(newSelection._id);
      setSelectedChat(newSelection);
    },
    [pushState],
  );

  const handleCreateChat = useCallback(
    async (newChatName: string) => {
      await createChat({ name: newChatName });
    },
    [createChat],
  );

  const handleDeleteChat = useCallback(
    async (chat: Chat) => {
      setSelectedChat("loading");
      await deleteChat({ chatId: chat._id });
    },
    [deleteChat],
  );

  const handleChatNameChange = useCallback(
    async (chat: Chat, newName: string) => {
      await patchChat({
        chatId: chat._id,
        name: newName,
      });
    },
    [patchChat],
  );

  const handleChatAvatarChange = useCallback(
    async (chat: Chat, newAvatar: Blob) => {
      const newImage = await upload(newAvatar);
      await patchChat({
        chatId: chat._id,
        image: newImage,
      });
    },
    [patchChat],
  );

  const handleLifespanChange = useCallback(
    async (chat: Chat, newLifespan: number) => {
      await patchChat({
        chatId: chat._id,
        messageLifespan: newLifespan,
      });
    },
    [patchChat],
  );

  const handleCreateInvite = useCallback(
    async (chat: Chat, inviteEmail: string) => {
      await createInvite({
        chatId: chat._id,
        email: inviteEmail,
      });
    },
    [createInvite],
  );

  const handleRevokeInvite = useCallback(
    async (invite: Invite) => {
      await revokeInvite({ inviteId: invite._id });
    },
    [revokeInvite],
  );

  const handleUpdateMember = useCallback(
    async (member: Member, newRole: Role) => {
      await updateMember({ memberId: member._id, role: newRole });
    },
    [updateMember],
  );

  const handleRemoveMember = useCallback(
    async (member: Member) => {
      await removeMember({ memberId: member._id });
    },
    [removeMember],
  );

  const handleSendMessage = useCallback(
    async (chat: Chat, message: string) => {
      if (encryption === "loading" || selectedChatMembers === "loading") {
        return;
      }

      const { encrypt } = encryption;

      const encryptedMessages = await Promise.all(
        selectedChatMembers
          .flatMap((m) => m.sessions)
          .filter((s) => !s.isInactive && !!s.publicKey)
          .map(async (recipient) => ({
            text: await encrypt(message, recipient.publicKey!),
            recipientSessionId: recipient._id,
          })),
      );

      await sendMessage({
        chatId: chat._id,
        messages: encryptedMessages,
      });
    },
    [encryption, selectedChatMembers, sendMessage],
  );

  const handleReadMessage = useCallback(
    async (message: Message) => {
      if (message.readTime == null) {
        await markRead({ messageIds: [message._id] });
      }
    },
    [markRead],
  );

  // initialize active chat selection
  useEffect(() => {
    if (chats === "loading") return;
    const chatId =
      selectedChat && selectedChat !== "loading"
        ? selectedChat?._id
        : initialSelectedChatId;
    handleSelectChat(chats.find((c) => c._id === chatId) ?? chats[0]);
  }, [chats, selectedChat, initialSelectedChatId, handleSelectChat]);

  return (
    <ChatContainer
      chatList={chats}
      chat={selectedChat}
      members={selectedChatMembers}
      invites={selectedChatInvites}
      messages={decryptedMessages}
      handlers={{
        onSelectChat: handleSelectChat,
        onCreateChat: (newChatName) => void handleCreateChat(newChatName),
        onDeleteChat: (chat) => void handleDeleteChat(chat),
        onChatNameChange: (chat, n) => void handleChatNameChange(chat, n),
        onChatAvatarChange: (chat, a) => void handleChatAvatarChange(chat, a),
        onLifespanChange: (chat, ls) => void handleLifespanChange(chat, ls),
        onCreateInvite: (chat, email) => void handleCreateInvite(chat, email),
        onRevokeInvite: (invite) => void handleRevokeInvite(invite),
        onChangeMemberRole: (m, role) => void handleUpdateMember(m, role),
        onRemoveMember: (member) => void handleRemoveMember(member),
        onSendMessage: (chat, message) => void handleSendMessage(chat, message),
        onMessageRead: (message) => void handleReadMessage(message),
      }}
    />
  );
}
