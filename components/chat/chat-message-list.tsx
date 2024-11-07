import { ComponentProps, useCallback } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { cn, splitArray } from "@/lib/utils";

import {
  ChatBubble,
  ChatBubbleCountdown,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleTitle,
} from "./chat-bubble";
import { useChatContext } from "./chat-context";
import { ChatReadStatus } from "./chat-read-status";
import { Member, Message } from "./chat-types";

import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

export function ChatMessageList() {
  const {
    state: { members, messages },
    onMessageRead,
  } = useChatContext();

  const handleMessageRead = useCallback(
    (message: Message) => onMessageRead?.(message),
    [onMessageRead],
  );

  return (
    <div className="flex h-full w-full flex-col-reverse gap-1 overflow-y-auto overflow-x-hidden px-4 py-0">
      <AnimatePresence>
        <Suspense
          fallback={ChatBubbleSkeleton}
          component={({ messages, members }) => {
            let memberReadTimes = members
              .filter((m) => !m.isViewer)
              .reduce<(Member & { lastReadTime: number })[]>(
                (times, member) => {
                  const lastReadTime = Math.max(
                    ...member.sessions.map(
                      (session) => session.lastReadTime ?? 0,
                    ),
                  );
                  times.push({ ...member, lastReadTime });
                  return times;
                },
                [],
              );

            return messages.map((message, index) => {
              const nextMessageAuthor = messages[index + 1]?.author._id;
              const isSameAuthor = nextMessageAuthor === message.author._id;
              const showTitle =
                !message.isViewer && members.length > 2 && !isSameAuthor;

              const variant = message.isViewer ? "sent" : "received";
              const isShort =
                message.text.length <= 15 && !message.text.includes("\n");

              const [messageReadTimes, memberReadTimesRemaining] = splitArray(
                memberReadTimes,
                ({ lastReadTime }) => lastReadTime >= message._creationTime,
              );
              memberReadTimes = memberReadTimesRemaining;

              return (
                <MotionDiv
                  key={message._id}
                  index={index}
                  className="flex flex-col gap-2"
                >
                  <ChatBubble
                    variant={variant}
                    onRead={() => handleMessageRead(message)}
                  >
                    {showTitle && (
                      <ChatBubbleTitle>{message.author.name}</ChatBubbleTitle>
                    )}
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
                  {messageReadTimes.length > 0 && (
                    <ChatReadStatus value={messageReadTimes} />
                  )}
                </MotionDiv>
              );
            });
          }}
          componentProps={{ messages, members }}
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

const skeletonMessages: ("sent" | "received")[] = [
  "sent",
  "sent",
  "received",
  "sent",
  "received",
  "sent",
  "sent",
];
function ChatBubbleSkeleton(props: ComponentProps<typeof Skeleton>) {
  return (
    <>
      <MotionDiv className="flex flex-col">
        <Skeleton size="6" layout="icon" className="self-end" {...props} />
      </MotionDiv>
      {skeletonMessages.map((variant, index) => (
        <MotionDiv key={variant + index} className="flex flex-col">
          <ChatBubble variant={variant}>
            <Skeleton asChild {...props}>
              <ChatBubbleMessage
                variant={variant}
                className={cn(
                  `h-${index === 1 || index === 4 ? 24 : 9}`,
                  "w-32 bg-primary/10",
                )}
              />
            </Skeleton>
          </ChatBubble>
        </MotionDiv>
      ))}
    </>
  );
}
