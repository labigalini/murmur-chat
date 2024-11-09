"use client";

import { useParams, useSearchParams } from "next/navigation";

import { INVITE_PARAM } from "@/lib/constants";

import ChatBoard from "./_components/ChatBoard";

export default function Page() {
  const { chatId } = useParams<{ chatId?: string }>();
  const searchParams = useSearchParams();

  const _invite = searchParams.get(INVITE_PARAM);
  // TODO open dialog to accept invite

  return <ChatBoard selectedChatId={chatId} />;
}
