import * as React from "react";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { Member } from "./chat-types";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface ChatReadStatusProps {
  className?: string;
  value: (Member & { lastReadTime: number })[];
}

const ChatReadStatus = React.forwardRef<HTMLDivElement, ChatReadStatusProps>(
  ({ className, value, ...props }, ref) => (
    <div
      className={cn("flex flex-row justify-end", className)}
      {...props}
      ref={ref}
    >
      {/* add line to mark the separation and align items horizontally */}
      {value.map((member) => (
        <TooltipProvider key={member._id}>
          <Tooltip key={member._id} delayDuration={0}>
            <TooltipTrigger className="cursor-default">
              <ChatAvatar
                key={member._id}
                name={member.name}
                avatar={member.image}
                size={6}
              />
            </TooltipTrigger>
            <TooltipContent side="left">{member.name}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
      {/* do like a hover and move the avatars around keepong only the focused one on the center */}
    </div>
  ),
);
ChatReadStatus.displayName = "ChatReadStatus";

export { ChatReadStatus };
