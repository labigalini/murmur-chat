"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { Chat } from "@/components/chat/chat-types";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useSuspenseQuery } from "@/hooks";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useState } from "react";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const chats = useSuspenseQuery(api.chats.list);

  const [selectedChat, setSelectedChat] = useState<Chat | null>();
  useEffect(() => {
    if (chats && chats.length > 0 && !selectedChat) {
      setSelectedChat(chats[0]);
    }
  }, [chats, selectedChat]);

  const selectedChatMessages = useQuery(
    api.messages.list,
    selectedChat
      ? {
          chatId: selectedChat._id as Id<"chats">,
        }
      : "skip",
  );
  const handleSelectChat = useCallback((newSelection: Chat) => {
    setSelectedChat(newSelection);
  }, []);

  const createChat = useMutation(api.chats.create);
  const handleCreateChat = useCallback(
    async (newChat: string) => {
      await createChat({ name: newChat });
    },
    [createChat],
  );

  const sendMessage = useMutation(api.messages.create);
  const handleSendMessage = useCallback(
    async (newMessage: string) => {
      if (!selectedChat) return;
      await sendMessage({
        chatId: selectedChat._id as Id<"chats">,
        text: newMessage,
      });
    },
    [selectedChat, sendMessage],
  );

  if (!chats || !selectedChat || !selectedChatMessages) return;

  return (
    <ChatContainer
      chats={chats}
      selectedChat={{ ...selectedChat, messages: selectedChatMessages }}
      defaultLayout={defaultLayout}
      handlers={{
        onSelectChat: handleSelectChat,
        onCreateChat: (newChat) => void handleCreateChat(newChat),
        onSendMessage: (newMessage) => void handleSendMessage(newMessage),
      }}
    />
  );
}
