"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { Chat } from "@/components/chat/chat-types";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "@/hooks";
import { useMutation } from "convex/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const chats = useQuery(api.chats.list);

  const [selectedChat, setSelectedChat] = useState<"loading" | Chat | null>(
    "loading",
  );
  useEffect(() => {
    if (chats !== "loading" && selectedChat === "loading") {
      setSelectedChat(chats.length > 0 ? chats[0] : null);
    }
  }, [chats, selectedChat]);

  const selectedChatMessages = useQuery(
    api.messages.list,
    selectedChat === "loading" || !selectedChat
      ? "skip"
      : { chatId: selectedChat._id as Id<"chats"> },
  );
  const handleSelectChat = useCallback((newSelection: Chat) => {
    setSelectedChat(newSelection);
  }, []);

  const createChat = useMutation(api.chats.create);
  const handleCreateChat = useCallback(
    (newChatName: string) => {
      void createChat({ name: newChatName });
    },
    [createChat],
  );

  const sendMessage = useMutation(api.messages.create);
  const handleSendMessage = useCallback(
    (chat: Chat, message: string) => {
      void sendMessage({
        chatId: chat._id as Id<"chats">,
        text: message,
      });
    },
    [sendMessage],
  );

  const selectedChatWithMessages = useMemo(
    () =>
      selectedChat === "loading" || !selectedChat
        ? selectedChat
        : { ...selectedChat, messages: selectedChatMessages },
    [selectedChat, selectedChatMessages],
  );

  return (
    <ChatContainer
      chats={chats}
      selectedChat={selectedChatWithMessages}
      defaultLayout={defaultLayout}
      handlers={{
        onSelectChat: handleSelectChat,
        onCreateChat: handleCreateChat,
        onSendMessage: handleSendMessage,
      }}
    />
  );
}
