"use client";

import { useCallback, useEffect, useState } from "react";

import { useMutation } from "convex/react";

import { ChatContainer } from "@/components/chat/chat-container";
import { Chat } from "@/components/chat/chat-types";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import {
  decryptText,
  encryptText,
  encryptedDataToString,
  stringToEncryptedData,
} from "@/lib/encryption";
import { skipIfUnset } from "@/lib/utils";

import { useEncryption, useQuery } from "@/hooks";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const encryption = useEncryption();

  const chats = useQuery(api.chats.list);

  const [selectedChat, setSelectedChat] = useState<"loading" | Chat | null>(
    "loading",
  );
  useEffect(() => {
    if (chats !== "loading" && (!chats.length || selectedChat === "loading")) {
      setSelectedChat(chats[0] ?? null);
    }
  }, [chats, selectedChat]);

  const selectedChatMessages = useQuery(
    api.messages.list,
    skipIfUnset(selectedChat, (c) => ({
      chatId: c._id as Id<"chats">,
    })),
  );

  const createChat = useMutation(api.chats.create);
  const sendMessage = useMutation(api.messages.create);

  const handleSelectChat = useCallback((newSelection: Chat) => {
    setSelectedChat(newSelection);
  }, []);

  const handleCreateChat = useCallback(
    async (newChatName: string) => {
      await createChat({ name: newChatName });
    },
    [createChat],
  );

  const handleSendMessage = useCallback(
    async (chat: Chat, message: string) => {
      if (encryption === "loading") return;

      const { publicKey, privateKey } = encryption;

      const { encryptedData, iv } = await encryptText(
        privateKey,
        publicKey,
        message,
      );
      const encryptedMessage = encryptedDataToString(encryptedData, iv);
      await sendMessage({
        chatId: chat._id as Id<"chats">,
        text: encryptedMessage,
        // TODO probably need to send one message to each pub key maybe change schema
      });
    },
    [encryption, sendMessage],
  );

  const [decryptedMessages, setDecryptedMessages] =
    useState<typeof selectedChatMessages>("loading");

  useEffect(() => {
    const decryptMessages = async () => {
      if (
        !selectedChatMessages ||
        selectedChatMessages === "loading" ||
        encryption === "loading"
      ) {
        setDecryptedMessages("loading");
        return;
      }

      const { publicKey, privateKey } = encryption;

      const decrypted = await Promise.all(
        selectedChatMessages.map(async (original) => {
          const { encryptedData, iv } = stringToEncryptedData(original.text);
          const decryptedText = original.isViewer
            ? await decryptText(privateKey, publicKey, encryptedData, iv)
            : original.text;
          return {
            ...original,
            text: decryptedText,
          };
        }),
      );
      console.log(decrypted);
      setDecryptedMessages(decrypted);
    };

    decryptMessages().catch(console.error);
  }, [encryption, selectedChatMessages]);

  return (
    <ChatContainer
      chatList={chats}
      chat={selectedChat}
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
