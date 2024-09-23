import * as React from "react";

import { cn, fr } from "@/lib/utils";

interface ChatTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  count?: number;
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl";
}

const ChatTitle = fr<HTMLDivElement, ChatTitleProps>(
  ({ title, count, size = "base", className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(`flex items-center gap-2 text-${size}`, className)}
        {...props}
      >
        <p className="font-medium">{title}</p>
        {count != null && (
          <span className="text-zinc-500 dark:text-zinc-300">({count})</span>
        )}
      </div>
    );
  },
);

ChatTitle.displayName = "ChatTitle";

export { ChatTitle };
