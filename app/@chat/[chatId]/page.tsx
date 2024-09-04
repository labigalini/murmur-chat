import { cookies } from "next/headers";
import ChatBoard from "./_components/ChatBoard";

export default function ChatPage({ params }: { params: { chatId?: string } }) {
  const { chatId: _t } = params;

  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout
    ? (JSON.parse(layout.value) as number[])
    : undefined;

  return <ChatBoard defaultLayout={defaultLayout} />;
}
