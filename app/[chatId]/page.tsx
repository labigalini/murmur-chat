import ChatBoard from "./_components/ChatBoard";

export default function Page({ params }: { params: { chatId?: string } }) {
  const { chatId } = params;
  return <ChatBoard selectedChatId={chatId} />;
}
