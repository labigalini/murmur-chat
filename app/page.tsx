import { ChatLayout } from "@/components/chat/chat-layout";
import { cookies } from "next/headers";

export default function Home() {
  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <main className="w-full h-full">
      <ChatLayout defaultLayout={defaultLayout} />
    </main>
  );
}
