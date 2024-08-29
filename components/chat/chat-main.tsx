import { ChatList } from "./chat-list";
import ChatTopbar from "./chat-topbar";
import { Chat, Message } from "./chat-types";

interface ChatProps {
  chat: Chat;
  messages: Message[];
  sendMessage: (newMessage: string) => void;
  isMobile: boolean;
}

export function ChatMain({ chat, messages, sendMessage, isMobile }: ChatProps) {
  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar name={chat.name} image={chat.image} />

      <ChatList
        messages={messages}
        selectedChat={chat}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
