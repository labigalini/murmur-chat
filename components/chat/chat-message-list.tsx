import { AnimatePresence, motion } from "framer-motion";

import ChatAvatar from "./chat-avatar";
import {
  ChatBubble,
  ChatBubbleCountdown,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "./chat-bubble";
import { useChatContext } from "./chat-context";

export function ChatMessageList() {
  const {
    state: { messages },
  } = useChatContext();

  if (messages === "loading") return "Loading messages";

  return (
    <div className="flex h-full w-full flex-col-reverse gap-6 overflow-y-auto p-4">
      <AnimatePresence>
        {messages.map((message, index) => {
          const variant = message.isViewer ? "sent" : "received";
          return (
            <motion.div
              key={message._id}
              layout
              initial={{
                opacity: 0,
                scale: 1,
                y: 50,
                x: 0,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                x: 0,
              }}
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
                    duration={message._expirationTime - message._creationTime}
                  />
                </ChatBubbleMessage>
              </ChatBubble>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
