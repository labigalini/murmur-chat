import * as React from "react";

import { cn, fr } from "@/lib/utils";

import { Hesitate } from "../ui/hesitate";

interface ChatTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  count?: number | "loading";
}

const ChatTitle = fr<HTMLDivElement, ChatTitleProps>(
  ({ title, count, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(`flex items-center gap-2 text-base`, className)}
        {...props}
      >
        <p className="font-medium">{title}</p>
        {count != null && (
          <span className="text-zinc-500 dark:text-zinc-300">
            ( <Hesitate width={8} component={count} props={{ count }} /> )
          </span>
        )}
      </div>
    );
  },
);

ChatTitle.displayName = "ChatTitle";

export { ChatTitle };
