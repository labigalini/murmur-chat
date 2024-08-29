import { cookies } from "next/headers";
import { Suspense } from "react";
import ChatBoard from "./_components/ChatBoard";
import Loading from "./loading";

export default function Chat({ params }: { params: { chatId?: string } }) {
  const { chatId: _t } = params;

  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout
    ? (JSON.parse(layout.value) as number[])
    : undefined;

  return (
    <Suspense fallback={<Loading />}>
      <ChatBoard defaultLayout={defaultLayout} />{" "}
    </Suspense>
  );
}
