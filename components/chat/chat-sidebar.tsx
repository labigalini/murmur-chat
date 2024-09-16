"use client";

import { useState } from "react";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

import { DotsHorizontalIcon, Pencil2Icon } from "../icons";

interface ChatSidebarProps {
  isCollapsed: boolean;
}

export function ChatSidebar({ isCollapsed }: ChatSidebarProps) {
  const {
    state: { chatList, chat: selectedChat },
    onSelectChat,
  } = useChatContext();

  if (chatList === "loading" || selectedChat === "loading")
    return "Loading chat list";

  return (
    <div className="group relative flex h-full flex-col bg-muted/10 p-2 dark:bg-muted/20">
      <ChatSidebarTopbar
        isCollapsed={isCollapsed}
        chatCount={chatList.length}
      />
      <div className="h-full overflow-y-auto px-2">
        <nav
          data-collapsed={isCollapsed}
          className="grid data-[collapsed=true]:justify-center"
        >
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
                        "h-16 w-16",
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
    </div>
  );
}

function ChatSidebarTopbar({
  isCollapsed,
  chatCount,
}: {
  isCollapsed: boolean;
  chatCount: number;
}) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

  return (
    <div
      data-collapsed={isCollapsed}
      className="flex items-center justify-between pb-5 pl-3 pr-2 pt-2 data-[collapsed=true]:justify-center data-[collapsed=true]:py-0"
    >
      {!isCollapsed && (
        <div className="flex items-center gap-2 text-2xl">
          <p className="font-medium">Chats</p>
          <span className="text-zinc-300">({chatCount})</span>
        </div>
      )}

      <ChatCreateDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <div>
        {isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Link
                href="#"
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "icon",
                  }),
                  "h-16 w-16",
                )}
              >
                <DotsHorizontalIcon className="h-5 w-5" />
              </Link>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Chats ({chatCount})</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link
                  href="#"
                  onClick={() => setOpenCreateDialog(true)}
                  className="flex w-full items-center gap-2"
                >
                  <Pencil2Icon className="h-5 w-5" />
                  Create new chat
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isCollapsed && (
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
            <Pencil2Icon className="h-5 w-5" />
          </Link>
        )}
      </div>
    </div>
  );
}
