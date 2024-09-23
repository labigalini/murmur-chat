"use client";

import { useState } from "react";

import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { ChatTitle } from "./chat-title";

import { DotsHorizontalIcon, Pencil2Icon } from "../icons";

interface ChatSidebarProps {
  isCollapsed: boolean;
}

export function ChatList({ isCollapsed }: ChatSidebarProps) {
  const {
    state: { chatList, chat: selectedChat, urlPrefix },
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
            const isSelected = selectedChat?._id === chat._id;
            const variant = isSelected ? "grey" : ("ghost" as "grey" | "ghost");
            return isCollapsed ? (
              <TooltipProvider key={chat._id}>
                <Tooltip key={chat._id} delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Link
                      href={urlPrefix + chat._id}
                      onClick={(e) => {
                        if (!isSelected) onSelectChat(chat);
                        e.preventDefault();
                      }}
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
                      <ChatAvatar name={chat.name} avatar={chat.image} />
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
                href={urlPrefix + chat._id}
                onClick={(e) => {
                  if (!isSelected) onSelectChat(chat);
                  e.preventDefault();
                }}
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
                <div className="flex min-w-0 flex-col">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="min-w-0 truncate">{chat.name}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{chat.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
      className="flex items-center justify-between pb-3 pl-3 pr-2 pt-1 data-[collapsed=true]:justify-center data-[collapsed=true]:py-0"
    >
      {!isCollapsed && <ChatTitle title="Chats" count={chatCount} size="2xl" />}

      <ChatCreateDialog
        open={openCreateDialog}
        onOpenChange={setOpenCreateDialog}
      />

      <div>
        {isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-16 w-16"
              >
                <DotsHorizontalIcon className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>
                <p className="text-lg">Chats ({chatCount})</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenCreateDialog(true)}
                  className="flex w-full gap-4"
                >
                  Create new chat
                  <Pencil2Icon className="h-4 w-4" />
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {!isCollapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setOpenCreateDialog(true)}
            className="h-12 w-12"
          >
            <Pencil2Icon className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
}
