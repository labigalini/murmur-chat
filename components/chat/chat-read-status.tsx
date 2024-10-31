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
    const [mouseX, setMouseX] = React.useState(0);
    const value = Array(100).fill(initialValue).flat() as (Member & {
      lastReadTime: number;
    })[];

    return (
      <div className={cn("flex h-6", className)} {...props} ref={ref}>
        <div className="flex-1">mouse: {mouseX}</div>
        {/* add line to mark the separation and align items horizontally */}
        <div
          className="relative flex w-[300px]"
          onMouseLeave={() => setMouseX(0)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMouseX(e.clientX - rect.left);
          }}
        >
          {value.map((member, index) => (
            <TooltipProvider key={member._id}>
              <Tooltip delayDuration={0}>
                <TooltipTrigger
                  className={cn(
                    "absolute transition-all duration-300 ease-in-out",
                  )}
                  style={{
                    left: calculatePosition(index, value.length, mouseX),
                  }}
                >
                  <ChatAvatar
                    name={index + member.name}
                    avatar={member.image}
                    size={6}
                  />
                </TooltipTrigger>
                <TooltipContent side="top" align="end">
                  {member.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
      </div>
    );
  },
);

const calculatePosition = (index: number, length: number, mouseX: number) => {
  const TOTAL_WIDTH = 300;
  const AVATAR_WIDTH = 24;
  const VIZ_GAP = 4;
  const VIZ_COUNT = 10;
  const VIZ_WIDTH = VIZ_COUNT * (VIZ_GAP + AVATAR_WIDTH);
  const STACK_END = TOTAL_WIDTH - VIZ_WIDTH;

  if (index >= length - VIZ_COUNT)
    return `${TOTAL_WIDTH - (length - index) * (VIZ_WIDTH / VIZ_COUNT)}px`;
  return `${index * (STACK_END / length)}px`;
};

ChatReadStatus.displayName = "ChatReadStatus";

export { ChatReadStatus };
