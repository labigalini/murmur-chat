import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import ChatAvatar from "./chat-avatar";
import ChatBottombar from "./chat-bottombar";
import { Chat, Message } from "./chat-types";

interface ChatListProps {
  messages?: Message[];
  selectedChat: Pick<Chat, "name">;
  sendMessage: (newMessage: string) => void;
  isMobile: boolean;
}

export function ChatList({
  messages,
  selectedChat,
  sendMessage,
  isMobile,
}: ChatListProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col">
      <div
        ref={messagesContainerRef}
        className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col"
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: "spring",
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                message.name !== selectedChat.name
                  ? "items-end"
                  : "items-start",
              )}
            >
              <div className="flex gap-3 items-center">
                {message.name === selectedChat.name && (
                  <ChatAvatar name={message.name} avatar={message.avatar} />
                )}
                <span className=" bg-accent p-3 rounded-md max-w-xs">
                  {message.message}
                </span>
                {message.name !== selectedChat.name && (
                  <ChatAvatar name={message.name} avatar={message.avatar} />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottombar sendMessage={sendMessage} isMobile={isMobile} />
    </div>
  );
}
