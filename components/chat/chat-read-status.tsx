"use client";

import * as React from "react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { Member } from "./chat-types";

interface ChatReadStatusProps {
  className?: string;
  value: (Member & { lastReadTime: number })[];
}

const ChatReadStatus = React.forwardRef<HTMLDivElement, ChatReadStatusProps>(
  ({ className, value: initialValue, ...props }, ref) => {
    const [mouseX, setMouseX] = React.useState(300);
    const value = React.useMemo(
      () =>
        initialValue.map((member, index) => ({
          ...member,
          position: calculatePosition(index, initialValue.length, mouseX),
        })),
      [initialValue, mouseX],
    );

    return (
      <div
        className={cn("relative h-6 w-[300px] self-end", className)}
        onMouseLeave={() => setMouseX(300)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setMouseX(Math.ceil(e.clientX - rect.left));
        }}
        {...props}
        ref={ref}
      >
        {value.map((member) => (
          <TooltipProvider key={member._id}>
            <Tooltip delayDuration={0}>
              <TooltipTrigger
                className="absolute cursor-default transition-all duration-300 ease-in-out"
                style={{ left: member.position }}
              >
                <ChatAvatar name={member.name} avatar={member.image} size={6} />
              </TooltipTrigger>
              <TooltipContent side="top" align="end">
                {member.name}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  },
);

const calculatePosition = (index: number, length: number, mouseX: number) => {
  const TOTAL_WIDTH = 300;
  const AVATAR_GAP = 1;
  const AVATAR_WIDTH = 24 + AVATAR_GAP;
  const WINDOW_COUNT = 10;
  const WINDOW_WIDTH = WINDOW_COUNT * AVATAR_WIDTH;
  const WINDOW_START = (TOTAL_WIDTH - WINDOW_WIDTH) / 2;
  const WINDOW_END = WINDOW_START + WINDOW_WIDTH;

  if (length < 12) return `${TOTAL_WIDTH - (length - index) * AVATAR_WIDTH}px`;

  // Calculate the center index based on mouseX
  const mousePosition = Math.min(WINDOW_END, mouseX);
  const centerIndex =
    Math.ceil((mousePosition / WINDOW_END) * length) - WINDOW_COUNT / 2 - 1;
  // Calculate start and end indices for the visible window
  const indexStart = Math.max(1, centerIndex - WINDOW_COUNT / 2);
  const indexEnd = Math.min(length - 2, indexStart + WINDOW_COUNT);

  if (index < indexStart) {
    return `${index * (WINDOW_START / length)}px`;
  }

  if (index > indexEnd) {
    return `${WINDOW_END + (index - indexEnd) * ((TOTAL_WIDTH - WINDOW_END) / length)}px`;
  }

  // If index is within the visible window
  return `${WINDOW_END - AVATAR_WIDTH - (indexEnd - index) * AVATAR_WIDTH}px`;
};

ChatReadStatus.displayName = "ChatReadStatus";

export { ChatReadStatus };
