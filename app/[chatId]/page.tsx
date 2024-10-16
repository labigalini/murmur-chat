import { INVITE_PARAM } from "@/lib/constants";

import ChatBoard from "./_components/ChatBoard";

export default function Page({
  params,
  searchParams,
}: {
  params: { chatId?: string };
  searchParams: { [INVITE_PARAM]?: string };
}) {
  const { chatId } = params;
  const invite = searchParams[INVITE_PARAM];
  console.log({ invite });
  // TODO open dialog to accept
  return <ChatBoard selectedChatId={chatId} />;
}
