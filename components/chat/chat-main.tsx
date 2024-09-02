import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import ChatAvatar from "./chat-avatar";
import ChatBottombar from "./chat-bottombar";
import { useChatContext } from "./chat-context";
import ChatTopbar from "./chat-topbar";

type ChatMainProps = {};

export function ChatMain({}: ChatMainProps) {
  const {
    state: {
      selectedChat: { messages, ...chat },
    },
  } = useChatContext();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar name={chat.name} image={chat.image} />
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
                  message.author !== chat.name ? "items-end" : "items-start",
                )}
              >
                <div className="flex gap-3 items-center">
                  {message.author === chat.name && (
                    <ChatAvatar
                      name={message.author}
                      avatar={message.authorImage}
                    />
                  )}
                  <span className=" bg-accent p-3 rounded-md max-w-xs">
                    {message.text}
                  </span>
                  {message.author !== chat.name && (
                    <ChatAvatar
                      name={message.author}
                      avatar={message.authorImage}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <ChatBottombar />
      </div>
    </div>
  );
}
