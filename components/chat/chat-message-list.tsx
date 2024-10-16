import { ComponentProps, useCallback } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import {
  ChatBubble,
  ChatBubbleCountdown,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "./chat-bubble";
import { useChatContext } from "./chat-context";
import { Message } from "./chat-types";

import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

export function ChatMessageList() {
  const {
    state: { messages },
    onMessageRead,
  } = useChatContext();

  const handleMessageRead = useCallback(
    (message: Message) => onMessageRead?.(message),
    [onMessageRead],
  );

  return (
    <div className="flex h-full w-full flex-col-reverse gap-4 overflow-y-auto overflow-x-hidden p-4">
      <AnimatePresence>
        <Suspense
          fallback={ChatBubbleSkeleton}
          component={({ messages }) =>
            messages.map((message, index) => {
              const variant = message.isViewer ? "sent" : "received";
              const isShort =
                message.text.length <= 15 && !message.text.includes("\n");
              return (
                <MotionDiv
                  key={message._id}
                  index={index}
                  className="flex flex-col"
                >
                  <ChatBubble
                    variant={variant}
                    onRead={() => handleMessageRead(message)}
                  >
                    <ChatAvatar
                      name={message.author.name}
                      avatar={message.author.image}
                    />
                    <ChatBubbleMessage
                      variant={variant}
                      style={{ display: isShort ? "inline-flex" : "block" }}
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
                </MotionDiv>
              );
            })
          }
          componentProps={{ messages }}
        />
      </AnimatePresence>
    </div>
  );
}

function MotionDiv({
  children,
  index = 1,
  ...props
}: React.ComponentProps<typeof motion.div> & { index?: number }) {
  return (
    <motion.div
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
      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }} // TODO animate exit as well
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: index * 0.05 + 0.2,
        },
      }}
      style={{ originX: 0.5, originY: 0.5 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function ChatBubbleSkeleton(props: ComponentProps<typeof Skeleton>) {
  return (
    ["sent", "received", "sent", "sent"] satisfies ("sent" | "received")[]
  ).map((variant, index) => (
    <MotionDiv key={variant + index} className="flex flex-col">
      <ChatBubble variant={variant}>
        <Skeleton size="9" layout="icon" {...props} />
        <Skeleton asChild {...props}>
          <ChatBubbleMessage
            variant={variant}
            className={cn(
              `h-${variant === "sent" ? 12 : 24}`,
              "w-32 bg-primary/10",
            )}
          />
        </Skeleton>
      </ChatBubble>
    </MotionDiv>
  ));
}
