"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useMemo } from "react";
import { CreateChatButton } from "./(components)/CreateChatButton";
import { MessageBoard } from "./(components)/MessageBoard";

export default function Home() {
  const chats = useQuery(api.chats.list);
  const chatId = useMemo(() => chats?.[0]?._id, [chats]);

  return (
    <main className="container">
      <h1 className="text-4xl font-extrabold my-8">My Murmur Chats</h1>
      {chatId == null ? <CreateChatButton /> : <MessageBoard chatId={chatId} />}
    </main>
  );
}
