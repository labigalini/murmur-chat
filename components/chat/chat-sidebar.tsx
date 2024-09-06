"use client";

import { useState } from "react";

import Link from "next/link";

import { MoreHorizontal, SquarePen } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatCreateDialog } from "./chat-create-dialog";

interface ChatSidebarProps {
  isCollapsed: boolean;
}

export function ChatSidebar({ isCollapsed }: ChatSidebarProps) {
  const {
    state: { chatList, chat: selectedChat },
    onSelectChat,
  } = useChatContext();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  if (chatList === "loading" || selectedChat === "loading")
    return "Loading chat list";

  return (
    <div
      data-collapsed={isCollapsed}
      className="group relative flex h-full flex-col gap-4 bg-muted/10 p-2 data-[collapsed=true]:p-2 dark:bg-muted/20"
    >
      <ChatCreateDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      {!isCollapsed && (
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center gap-2 text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({chatList.length})</span>
          </div>

          <div>
            <Link
              href="#"
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
                "h-9 w-9",
              )}
            >
              <MoreHorizontal size={20} />
            </Link>

            <Link
              href="#"
              onClick={() => setOpenCreateDialog(true)}
              className={cn(
                buttonVariants({
                  variant: "ghost",
                  size: "icon",
                }),
                "h-9 w-9",
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {chatList.map((chat) => {
          const variant =
            selectedChat?._id === chat._id
              ? "grey"
              : ("ghost" as "grey" | "ghost");
          return isCollapsed ? (
            <TooltipProvider key={chat._id}>
              <Tooltip key={chat._id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    onClick={() => onSelectChat(chat)}
                    className={cn(
                      buttonVariants({
                        variant,
                        size: "icon",
                      }),
                      "h-11 w-11 md:h-16 md:w-16",
                      variant === "grey" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    )}
                  >
                    <ChatAvatar name={chat.name} avatar={chat.image} />{" "}
                    <span className="sr-only">{chat.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {chat.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={chat._id}
              href="#"
              onClick={() => onSelectChat(chat)}
              className={cn(
                buttonVariants({
                  variant: variant,
                  size: "xl",
                }),
                variant === "grey" &&
                  "shrink dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "min-w-0 justify-start gap-4",
              )}
            >
              <ChatAvatar name={chat.name} avatar={chat.image} />
              <div className="max-w-28 flex min-w-0 flex-col">
                <span className="min-w-0 truncate">{chat.name}</span>
                {/* TODO need to show the unread message counter */}
                {/* {link.messages.length > 0 && (
                  <span className="text-zinc-300 text-xs truncate min-w-0">
                    {link.messages[link.messages.length - 1].name.split(" ")[0]}
                    : {link.messages[link.messages.length - 1].message}
                  </span>
                )} */}
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
