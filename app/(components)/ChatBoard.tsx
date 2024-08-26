"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { useSuspenseQuery } from "@/convex/suspense";
import { cn } from "@/lib/utils";
import { useMutation, usePaginatedQuery } from "convex/react";
import { Suspense, useCallback, useMemo, useRef, useState } from "react";
import { CreateChatButton } from "./CreateChatButton";

const FULL_DATE_TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
  dateStyle: "short",
});

const TIME_FORMAT = new Intl.DateTimeFormat(undefined, {
  timeStyle: "short",
});

function formatDateTime(timestamp: number) {
  const isToday =
    new Date(timestamp).setHours(0, 0, 0, 0) ===
    new Date().setHours(0, 0, 0, 0);
  if (isToday) {
    return TIME_FORMAT.format(timestamp);
  }
  return FULL_DATE_TIME_FORMAT.format(timestamp);
}

function Loading() {
  return <div>Loading chat...</div>;
}

function MessageBoard() {
  const chats = useSuspenseQuery(api.chats.list);
  const chatId = useMemo(() => chats?.[0]?._id, [chats]);

  const {
    results: messages,
    loadMore,
    status,
  } = usePaginatedQuery(api.messages.list, chatId ? { chatId } : "skip", {
    initialNumItems: 10,
  });
  const [message, setMessage] = useState("");
  const sendMessage = useMutation(api.messages.create);
  const listRef = useRef<HTMLElement>(null);
  const handleScroll = useCallback(() => {
    if (listRef.current === null) {
      return;
    }
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      status === "CanLoadMore"
    ) {
      loadMore(10);
    }
  }, [loadMore, status]);

  if (chatId == null) {
    return <></>;
  }

  return (
    <>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void sendMessage({ text: message, chatId: chatId! }).then(() => {
            setMessage("");
          });
        }}
      >
        <Textarea
          name="message"
          placeholder="Message text..."
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <Button disabled={message.trim() === ""} type="submit">
          Send Message
        </Button>
      </form>
      <ScrollArea className="h-72 rounded-md border" onScroll={handleScroll}>
        <div className="p-4">
          {messages.map((message) => (
            <div key={message._id} className="text-sm">
              <div className="flex">
                {/*eslint-disable-next-line @next/next/no-img-element*/}
                <img
                  src={message.authorImage}
                  alt="avatar"
                  className={cn(
                    "rounded-full inline-block mr-2 mt-[0.1875rem] w-8 h-8",
                    message.isAuthorDeleted && "grayscale",
                  )}
                  width={20}
                  height={20}
                />
                <div>
                  <div>
                    <span
                      className={cn(
                        "font-semibold",
                        message.isAuthorDeleted && "text-muted-foreground",
                      )}
                    >
                      {message.author}
                    </span>{" "}
                    <span className="text-muted-foreground text-xs whitespace-nowrap self-end">
                      {formatDateTime(message._creationTime)}
                    </span>
                  </div>
                  {message.text}
                </div>
              </div>
              <Separator className="my-2" />
            </div>
          ))}
          {status === "Exhausted" && messages.length === 0 && (
            <div className="text-muted-foreground">
              There are no messages posted yet
            </div>
          )}
        </div>
      </ScrollArea>
    </>
  );
}

export default function ChatBoard() {
  return (
    <div className="max-w-xl flex flex-col gap-2 mt-8">
      <CreateChatButton />
      <Suspense fallback={<Loading />}>
        <MessageBoard />
      </Suspense>
    </div>
  );
}
