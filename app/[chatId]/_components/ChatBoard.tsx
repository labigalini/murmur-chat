"use client";

import { useCallback, useEffect, useState } from "react";

import { useMutation } from "convex/react";

import { ChatContainer } from "@/components/chat/chat-container";
import { Chat } from "@/components/chat/chat-types";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { skipIfUnset } from "@/lib/utils";

import { useHistoryState } from "@/app/_context/HistoryStateProvider";

import { useEncryption, useQuery } from "@/hooks";

type ChatBoardProps = {
  selectedChatId?: string;
  defaultLayout?: number[];
};

export default function ChatBoard({
  selectedChatId,
  defaultLayout,
}: ChatBoardProps) {
  const encryption = useEncryption();
  const { pushState } = useHistoryState();

  const createChat = useMutation(api.chats.create);
  const sendMessage = useMutation(api.messages.create);

  const chats = useQuery(api.chats.list);
  const [selectedChat, setSelectedChat] = useState<"loading" | Chat | null>(
    "loading",
  );
  const selectedChatMembers = useQuery(
    api.members.list,
    skipIfUnset(selectedChat, (c) => ({
      chatId: c._id as Id<"chats">,
    })),
  );
  const selectedChatMessages = useQuery(
    api.messages.list,
    skipIfUnset(selectedChat, (c) => ({
      chatId: c._id as Id<"chats">,
    })),
  );
  const [decryptedMessages, setDecryptedMessages] =
    useState<typeof selectedChatMessages>("loading");

  // initialize active chat selection
  useEffect(() => {
    if (chats === "loading") return;
    setSelectedChat(
      chats.find((c) => c._id === selectedChatId) ?? chats[0] ?? null,
    );
  }, [chats, selectedChatId, setSelectedChat]);

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

  const handleSendMessage = useCallback(
    async (chat: Chat, message: string) => {
      if (encryption === "loading" || selectedChatMembers === "loading") {
        return;
      }

      const { encrypt } = encryption;

      const encryptedMessages = await Promise.all(
        selectedChatMembers
          .flatMap((m) => m.sessions)
          .map(async (recipient) => ({
            text: await encrypt(message, recipient.publicKey),
            recipientSessionId: recipient._id,
          })),
      );

      await sendMessage({
        chatId: chat._id as Id<"chats">,
        messages: encryptedMessages,
      });
    },
    [encryption, selectedChatMembers, sendMessage],
  );

  return (
    <ChatContainer
      chatList={chats}
      chat={selectedChat}
      members={selectedChatMembers}
      messages={decryptedMessages}
      defaultLayout={defaultLayout}
      handlers={{
        onSelectChat: handleSelectChat,
        onCreateChat: (newChatName) => void handleCreateChat(newChatName),
        onSendMessage: (chat, message) => void handleSendMessage(chat, message),
      }}
    />
  );
}
