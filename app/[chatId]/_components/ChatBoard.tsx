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
  loadKeyPair,
  stringToEncryptedData,
} from "@/lib/encryption";
import { skipIfUnset } from "@/lib/utils";

import { useQuery } from "@/hooks";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
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
      const keyData = await loadKeyPair();
      if (keyData == null) throw new Error("Encryption key not found");
      const { encryptedData, iv } = await encryptText(
        keyData.privateKey,
        keyData.publicKey,
        message,
      );
      const encryptedMessage = encryptedDataToString(encryptedData, iv);
      await sendMessage({
        chatId: chat._id as Id<"chats">,
        text: encryptedMessage,
        // TODO probably need to send one message to each pub key maybe change schema
      });
    },
    [sendMessage],
  );

  const [decryptedMessages, setDecryptedMessages] =
    useState<typeof selectedChatMessages>("loading");

  useEffect(() => {
    const decryptMessages = async () => {
      if (!selectedChatMessages || selectedChatMessages === "loading") {
        setDecryptedMessages("loading");
        return;
      }

      const keyData = await loadKeyPair();
      if (keyData == null) throw new Error("Encryption key not found");

      const decrypted = await Promise.all(
        selectedChatMessages.map(async (original) => {
          const { encryptedData, iv } = stringToEncryptedData(original.text);
          const decryptedText = original.isViewer
            ? await decryptText(
                keyData.privateKey,
                keyData.publicKey,
                encryptedData,
                iv,
              )
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
  }, [selectedChatMessages]);

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
