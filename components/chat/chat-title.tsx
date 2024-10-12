import * as React from "react";

import { cn, fr } from "@/lib/utils";

import { Suspense } from "../ui/suspense";

interface ChatTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  count?: number | "loading";
}

const ChatTitle = fr<HTMLDivElement, ChatTitleProps>(
  ({ title, count, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(`flex gap-2 text-base`, className)}
        {...props}
      >
        <span className="font-medium">{title}</span>
        {count !== undefined && (
          <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-300">
            <span>(</span>
            <Suspense
              fallbackProps={{ size: 8 }}
              component={({ count }) => <span>{count}</span>}
              componentProps={{ count }}
            />
            <span>)</span>
          </div>
        )}
      </div>
    );
  },
);

ChatTitle.displayName = "ChatTitle";

export { ChatTitle };
