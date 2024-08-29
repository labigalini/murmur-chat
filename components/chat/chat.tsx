import React from "react";
import { Message, ChatData } from "./chat-data";
import { ChatList } from "./chat-list";
import ChatTopbar from "./chat-topbar";

interface ChatProps {
  data: ChatData;
  isMobile: boolean;
}

export function Chat({ data, isMobile }: ChatProps) {
  const [messagesState, setMessages] = React.useState<Message[]>(
    data.messages ?? [],
  );

  const sendMessage = (newMessage: Message) => {
    setMessages([...messagesState, newMessage]);
  };

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar name={data.name} avatar={data.avatar} />

      <ChatList
        messages={messagesState}
        selectedChat={data}
        sendMessage={sendMessage}
        isMobile={isMobile}
      />
    </div>
  );
}
