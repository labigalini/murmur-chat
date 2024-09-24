import { AnimatePresence, motion } from "framer-motion";

import ChatAvatar from "./chat-avatar";
import {
  ChatBubble,
  ChatBubbleCountdown,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
} from "./chat-bubble";
import { useChatContext } from "./chat-context";

import { Loading } from "../ui/loading";
import { Skeleton } from "../ui/skeleton";

export function ChatMessageList() {
  const {
    state: { messages },
  } = useChatContext();

  return (
    <div className="flex h-full w-full flex-col-reverse gap-6 overflow-y-auto overflow-x-hidden p-4">
      <AnimatePresence>
        <Loading
          fallback={<ChatBubbleSkeleton />}
          component={({ messages }) =>
            messages.map((message, index) => {
              const variant = message.isViewer ? "sent" : "received";
              return (
                <MotionDiv
                  key={message._id}
                  index={index}
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
                </MotionDiv>
              );
            })
          }
          props={{ messages }}
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

function ChatBubbleSkeleton() {
  return (["sent", "received"] satisfies ("sent" | "received")[]).map(
    (variant) => (
      <MotionDiv key={variant} className="flex flex-col gap-2 p-4">
        <ChatBubble variant={variant}>
          <Skeleton size="9" />
          <Skeleton className="bg-transparent">
            <ChatBubbleMessage
              variant={variant}
              className="h-24 w-32 bg-primary/10"
            />
          </Skeleton>
        </ChatBubble>
      </MotionDiv>
    ),
  );
}
