import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import ChatAvatar from "./chat-avatar";
import ChatBottombar from "./chat-bottombar";
import {
  ChatBubble,
  ChatBubbleCountdown,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "./chat-bubble";
import { useChatContext } from "./chat-context";
import { ChatMessageList } from "./chat-message-list";
import ChatTopbar from "./chat-topbar";

export function ChatMain() {
  const {
    state: { selectedChat },
  } = useChatContext();

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [selectedChat]);

  if (selectedChat === "loading") return "Loading selected chat";
  else if (!selectedChat) return "No chat selected";

  const { messages, ...chat } = selectedChat;

  if (messages === "loading") return "Loading messages";

  return (
    <div className="flex flex-col justify-between w-full h-full">
      <ChatTopbar name={chat.name} image={chat.image} />
      <div className="w-full overflow-y-auto h-full flex flex-col">
        <ChatMessageList ref={messagesContainerRef}>
          <AnimatePresence>
            {messages.map((message, index) => {
              const variant = message.isViewer ? "sent" : "received";
              return (
                <motion.div
                  key={message._id}
                  layout
                  initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                  animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                  exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                  transition={{
                    opacity: { duration: 0.1 },
                    layout: {
                      type: "spring",
                      bounce: 0.3,
                      duration: index * 0.05 + 0.2,
                    },
                  }}
                  style={{ originX: 0.5, originY: 0.5 }}
                  className="flex flex-col gap-2 p-4"
                >
                  <ChatBubble variant={variant}>
                    <ChatAvatar
                      name={message.author.name}
                      avatar={message.author.image}
                    />
                    <ChatBubbleMessage
                      variant={variant}
                      // isLoading={message.isLoading} // TODO add support to typing...
                    >
                      {message.text}
                      <ChatBubbleTimestamp timestamp={message._creationTime} />
                      <ChatBubbleCountdown
                        variant={variant}
                        timestamp={message._expirationTime}
                        duration={
                          message._expirationTime - message._creationTime
                        }
                      />
                    </ChatBubbleMessage>
                  </ChatBubble>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </ChatMessageList>
      </div>
      <ChatBottombar />
    </div>
  );
}
