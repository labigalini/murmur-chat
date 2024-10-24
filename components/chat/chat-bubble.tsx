"use client";

import * as React from "react";

import { type VariantProps, cva } from "class-variance-authority";

import { Progress } from "@/components/ui/progress";

import { useObserver } from "@/hooks/useObserver";

import { cn } from "@/lib/utils";

import ChatMessageLoading from "./chat-message-loading";

// ChatBubble
const chatBubbleVariant = cva(
  "flex flex-col relative md:max-w-[80%] lg:max-w-[70%]",
  {
    variants: {
      variant: {
        received: "self-start items-start",
        sent: "self-end items-end",
      },
      layout: {
        default: "",
        ai: "max-w-full w-full items-center",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  },
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {}

const ChatBubble = React.forwardRef<
  HTMLDivElement,
  ChatBubbleProps & { onRead?: () => void }
>(({ onRead, className, variant, layout, children, ...props }, initialRef) => {
  const observedRef = useObserver({
    onVisible: () => onRead?.(),
    options: { threshold: 0.5 },
    ref: initialRef,
  });
  return (
    <div
      className={cn(chatBubbleVariant({ variant, layout, className }))}
      ref={observedRef}
      {...props}
    >
      {children}
    </div>
  );
});
ChatBubble.displayName = "ChatBubble";

// ChatBubbleTitle
type ChatBubbleTitleProps = React.HTMLAttributes<HTMLDivElement>;

const ChatBubbleTitle = React.forwardRef<HTMLDivElement, ChatBubbleTitleProps>(
  ({ children, className, ...props }, ref) => (
    <div className={cn("mx-2 mb-1", className)} ref={ref} {...props}>
      {children}
    </div>
  ),
);
ChatBubbleTitle.displayName = "ChatBubbleTitle";

// ChatBubbleMessage
const chatBubbleMessageVariants = cva("px-4 py-2 relative overflow-hidden", {
  variants: {
    variant: {
      received:
        "bg-secondary text-secondary-foreground rounded-r-sm rounded-tl-sm",
      sent: "bg-primary text-primary-foreground rounded-l-sm rounded-tr-sm",
    },
    layout: {
      default: "",
      ai: "border-t w-full rounded-none bg-transparent",
    },
  },
  defaultVariants: {
    variant: "received",
    layout: "default",
  },
});

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref,
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "max-w-full whitespace-pre-wrap break-words",
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <ChatMessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  ),
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: number;
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div
    className={cn(
      "ml-2 text-right text-xs leading-[inherit] text-gray-400",
      className,
    )}
    {...props}
  >
    {formatTime(timestamp)}
  </div>
);

// ChatBubbleCountdown
const chatBubbleCountdownVariant = cva("absolute bottom-0 left-0 w-full", {
  variants: {
    variant: {
      received: "pr-[4px]",
      sent: "pl-[4px]",
    },
  },
  defaultVariants: {
    variant: "received",
  },
});

interface ChatBubbleCountdownProps
  extends VariantProps<typeof chatBubbleCountdownVariant> {
  timestamp: number;
  duration: number;
}

function calculateProgress(timestamp: number, duration: number) {
  const now = Date.now();
  const timeLeft = Math.max(0, timestamp - now);
  const newProgress = (timeLeft / duration) * 100;
  return newProgress;
}

const ChatBubbleCountdown: React.FC<ChatBubbleCountdownProps> = ({
  variant,
  timestamp,
  duration,
}) => {
  const [progress, setProgress] = React.useState(
    calculateProgress(timestamp, duration),
  );

  React.useEffect(() => {
    const updateProgress = () => {
      setProgress(calculateProgress(timestamp, duration));
    };

    // Update every second
    const intervalId = setInterval(updateProgress, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [timestamp, duration]);

  return (
    <div className={chatBubbleCountdownVariant({ variant })}>
      <Progress
        value={progress}
        className="h-1 rounded-none bg-transparent"
        indicatorClassName="transition-transform duration-1000 ease-linear bg-blue-500"
      />
    </div>
  );
};

export {
  ChatBubble,
  ChatBubbleCountdown,
  ChatBubbleMessage,
  ChatBubbleTimestamp,
  ChatBubbleTitle,
  chatBubbleMessageVariants,
  chatBubbleVariant,
};
