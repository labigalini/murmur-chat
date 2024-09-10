"use client";

import { useCallback, useEffect, useState } from "react";

import { useMutation } from "convex/react";

import { ChatContainer } from "@/components/chat/chat-container";
import { Chat } from "@/components/chat/chat-types";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

import { skipIfUnset } from "@/lib/utils";

import { useAuth, useEncryption, useQuery } from "@/hooks";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const auth = useAuth();
  const encryption = useEncryption();

  const createChat = useMutation(api.chats.create);
  const sendMessage = useMutation(api.messages.create);

  const chats = useQuery(api.chats.list);
  const [selectedChat, setSelectedChat] = useState<"loading" | Chat | null>(
    "loading",
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
    if (chats !== "loading" && (!chats.length || selectedChat === "loading")) {
      setSelectedChat(chats[0] ?? null);
    }
  }, [chats, selectedChat]);

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
      if (auth === "loading" || encryption === "loading") return;

      const { session } = auth;
      const { encrypt } = encryption;

      if (!session?.publicKey) return; // TODO fix I don't like it

      const encryptedMessage = await encrypt(message, session.publicKey);

      await sendMessage({
        chatId: chat._id as Id<"chats">,
        messages: [{ text: encryptedMessage, recipientSessionId: session._id }],
      });
    },
    [auth, encryption, sendMessage],
  );

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
