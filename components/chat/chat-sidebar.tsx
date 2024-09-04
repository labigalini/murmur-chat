"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { MoreHorizontal, SquarePen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatCreateDialog } from "./chat-create-dialog";

interface SidebarProps {
  isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: SidebarProps) {
  const {
    state: { chats, selectedChat },
    onSelectChat,
  } = useChatContext();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  if (chats === "loading" || selectedChat === "loading")
    return "Loading chat list";

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2 "
    >
      <ChatCreateDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />
      {!isCollapsed && (
        <div className="flex justify-between p-2 items-center">
          <div className="flex gap-2 items-center text-2xl">
            <p className="font-medium">Chats</p>
            <span className="text-zinc-300">({chats.length})</span>
          </div>

          <div>
            <Link
              href="#"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
            >
              <MoreHorizontal size={20} />
            </Link>

            <Link
              href="#"
              onClick={() => setOpenCreateDialog(true)}
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9",
              )}
            >
              <SquarePen size={20} />
            </Link>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {chats
          .map((chat) => ({
            ...chat,
            variant:
              selectedChat?._id === chat._id
                ? "grey"
                : ("ghost" as "grey" | "ghost"),
          }))
          .map((chat) =>
            isCollapsed ? (
              <TooltipProvider key={chat._id}>
                <Tooltip key={chat._id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href="#"
                      onClick={() => onSelectChat(chat)}
                      className={cn(
                        buttonVariants({ variant: chat.variant, size: "icon" }),
                        "h-11 w-11 md:h-16 md:w-16",
                        chat.variant === "grey" &&
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
                  buttonVariants({ variant: chat.variant, size: "xl" }),
                  chat.variant === "grey" &&
                    "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                  "justify-start gap-4 min-w-0",
                )}
              >
                <ChatAvatar name={chat.name} avatar={chat.image} />
                <div className="flex flex-col max-w-28 min-w-0">
                  <span>{chat.name}</span>
                  {/* TODO need to show the unread message counter */}
                  {/* {link.messages.length > 0 && (
                  <span className="text-zinc-300 text-xs truncate min-w-0">
                    {link.messages[link.messages.length - 1].name.split(" ")[0]}
                    : {link.messages[link.messages.length - 1].message}
                  </span>
                )} */}
                </div>
              </Link>
            ),
          )}
      </nav>
    </div>
  );
}
