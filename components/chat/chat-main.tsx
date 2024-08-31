import { useChatContext } from "./chat-context";
import { ChatList } from "./chat-list";
import ChatTopbar from "./chat-topbar";
import { Chat, Message } from "./chat-types";

interface ChatProps {
  chat: Chat;
  messages: Message[];
  isMobile: boolean;
}

export function ChatMain({ chat, messages, isMobile }: ChatProps) {
  const { onSendMessage } = useChatContext();

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar name={chat.name} image={chat.image} />

      <ChatList
        messages={messages}
        selectedChat={chat}
        sendMessage={onSendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
