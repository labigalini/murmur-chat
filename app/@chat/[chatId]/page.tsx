import { cookies } from "next/headers";
import { Suspense } from "react";
import ChatBoard from "./_components/ChatBoard";
import Loading from "./loading";

export default async function Chat({
  params,
}: {
  params: { chatId?: string };
}) {
  const { chatId } = params;

  const layout = cookies().get("react-resizable-panels:layout");
  const defaultLayout = layout ? JSON.parse(layout.value) : undefined;

  return (
    <Suspense fallback={<Loading />}>
      <ChatBoard defaultLayout={defaultLayout} />{" "}
    </Suspense>
  );
}
