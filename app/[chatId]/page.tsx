import { cookies } from "next/headers";

import ChatBoard from "./_components/ChatBoard";

export default function Page({ params }: { params: { chatId?: string } }) {
  const { chatId } = params;

  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout
    ? (JSON.parse(layout.value) as number[])
    : undefined;

  return <ChatBoard defaultLayout={defaultLayout} selectedChatId={chatId} />;
}
 