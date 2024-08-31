"use client";

import { ChatContainer } from "@/components/chat/chat-container";
import { api } from "@/convex/_generated/api";
import { useSuspenseQuery } from "@/hooks";
import { useMutation } from "convex/react";
import { useCallback } from "react";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const chats = useSuspenseQuery(api.chats.list);
  const selectedChat = chats[0];

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
      await sendMessage({
        chatId: selectedChat._id,
        text: newMessage,
      });
    },
    [selectedChat, sendMessage],
  );

  if (!chats) return;

  return (
    <ChatContainer
      chats={chats}
      selectedChat={chats[0]}
      defaultLayout={defaultLayout}
      handlers={{
        onCreateChat: (newChat) => void handleCreateChat(newChat),
        onSendMessage: (newMessage) => void handleSendMessage(newMessage),
      }}
    />
  );
}
