"use client";

import { ChatLayout } from "@/components/chat/chat-layout";
import { api } from "@/convex/_generated/api";
import { useSuspenseQuery } from "@/hooks";
import { useMutation } from "convex/react";
import { useCallback, useState } from "react";
import { CreateChatDialog } from "./CreateChatDialog";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const chats = useSuspenseQuery(api.chats.list);
  const selectedChat = chats[0];

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const handleCreateChat = useCallback(() => {
    setOpenCreateDialog(true);
  }, [setOpenCreateDialog]);

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
    <>
      <CreateChatDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <ChatLayout
        chats={chats}
        selectedChat={chats[0]}
        defaultLayout={defaultLayout}
        handlers={{
          onCreateChat: handleCreateChat,
          onSendMessage: (newMessage) => {
            void handleSendMessage(newMessage);
          },
        }}
      />
    </>
  );
}
