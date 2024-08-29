"use client";

import { ChatData } from "@/components/chat/chat-data";
import { ChatLayout } from "@/components/chat/chat-layout";
import { api } from "@/convex/_generated/api";
import { useSuspenseQuery } from "@/hooks";
import { useCallback, useEffect, useState } from "react";
import { CreateChatDialog } from "./CreateChatDialog";

type ChatBoardProps = {
  defaultLayout?: number[];
};

export default function ChatBoard({ defaultLayout }: ChatBoardProps) {
  const chats = useSuspenseQuery(api.chats.list);
  const [chatData, setChatData] = useState<ChatData[]>();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  useEffect(() => {
    const newChatData = [];
    for (const chat of chats) {
      newChatData.push({ id: chat._id, name: chat.name });
    }
    setChatData(newChatData);
  }, [chats]);

  const handleCreateChat = useCallback(() => {
    setOpenCreateDialog(true);
  }, [setOpenCreateDialog]);

  if (!chatData) return;

  return (
    <>
      <CreateChatDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      <ChatLayout
        chatData={chatData}
        selectedChat={chatData[0]}
        defaultLayout={defaultLayout}
        handlers={{ onCreateChat: handleCreateChat }}
      />
    </>
  );
}
