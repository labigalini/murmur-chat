"use client";

import { ComponentProps, useState } from "react";

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
import { Chat } from "./chat-types";

import { DotsHorizontalIcon, Pencil2Icon } from "../icons";

interface ChatListProps {
  isCollapsed: boolean;
}

export function ChatList({ isCollapsed }: ChatListProps) {
  const {
    state: { chatList, chat: selectedChat, urlPrefix },
    onSelectChat,
  } = useChatContext();

  return (
    <div className="group relative flex h-full flex-col bg-muted/10 p-2 dark:bg-muted/20">
      <ChatListTopbar
        isCollapsed={isCollapsed}
        chatCount={chatList === "loading" ? "loading" : chatList.length}
      />
      <div className="h-full overflow-y-auto px-2">
        <nav
          data-collapsed={isCollapsed}
          className="grid data-[collapsed=true]:justify-center"
        >
          {chatList !== "loading" &&
            selectedChat !== "loading" &&
            chatList.map((chat) => (
              <ChatListLink
                key={chat._id}
                chat={chat}
                urlPrefix={urlPrefix}
                isSelected={selectedChat?._id === chat._id}
                onSelectChat={onSelectChat}
                isCollapsed={isCollapsed}
              />
            ))}
        </nav>
      </div>
    </div>
  );
}

function ChatListTopbar({
  isCollapsed,
  chatCount,
}: {
  isCollapsed: boolean;
  chatCount: number | "loading";
}) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const isLoading = chatCount === "loading";

  return (
    <div
      data-collapsed={isCollapsed}
      className="flex items-center justify-between pb-3 pl-3 pr-2 pt-1 data-[collapsed=true]:justify-center data-[collapsed=true]:py-0"
    >
      {!isCollapsed && (
        <ChatTitle title="Chats" count={chatCount} className="text-2xl" />
      )}
      <div>
        <ChatCreateDialog
          open={openCreateDialog}
          onOpenChange={setOpenCreateDialog}
        />
        {isCollapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-16 w-16"
              >
                <DotsHorizontalIcon size="6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>
                <ChatTitle
                  title="Chats"
                  count={chatCount}
                  className="text-lg"
                />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpenCreateDialog(true)}
                  className="flex w-full gap-4"
                  disabled={isLoading}
                >
                  Create new chat
                  <Pencil2Icon />
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
            disabled={isLoading}
          >
            <Pencil2Icon size="6" />
          </Button>
        )}
      </div>
    </div>
  );
}

function ChatListLink({
  chat,
  urlPrefix,
  isSelected,
  onSelectChat,
  isCollapsed,
  ...props
}: Omit<ComponentProps<typeof Link>, "href"> & {
  chat: Chat;
  urlPrefix: string;
  isSelected: boolean;
  isCollapsed: boolean;
  onSelectChat: (_chat: Chat) => void;
}) {
  return (
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
                variant: isSelected ? "grey" : "ghost",
                size: isCollapsed ? "icon" : "xl",
              }),
              isCollapsed ? "h-16 w-16" : "min-w-0 justify-start gap-4",
              isSelected &&
                "shrink dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
            )}
            {...props}
          >
            <ChatAvatar name={chat.name} avatar={chat.image} />
            <div className="flex min-w-0 flex-col">
              <span className={isCollapsed ? "sr-only" : "min-w-0 truncate"}>
                {chat.name}
              </span>
              {/* TODO need to show the unread message counter */}
              {/* {link.messages.length > 0 && (
          <span className="text-zinc-300 text-xs truncate min-w-0">
            {link.messages[link.messages.length - 1].name.split(" ")[0]}
            : {link.messages[link.messages.length - 1].message}
          </span>
        )} */}
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-4">
          {chat.name}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
