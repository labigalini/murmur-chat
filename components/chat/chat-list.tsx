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
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

interface ChatListProps {
  isCollapsed: boolean;
}

export function ChatList({ isCollapsed }: ChatListProps) {
  const {
    state: { chatList, chat: selectedChat, urlPrefix },
    onSelectChat,
  } = useChatContext();

  return (
    <div className="group relative flex h-full flex-col bg-muted/20 p-2">
      <ChatListTopbar
        isCollapsed={isCollapsed}
        chatCount={chatList === "loading" ? "loading" : chatList.length}
      />
      <div className={cn("h-full overflow-y-auto", !isCollapsed && "px-2")}>
        <nav className={cn("grid gap-1", isCollapsed && "justify-center")}>
          <Suspense
            fallback={ChatListSkeleton}
            fallbackProps={{ isCollapsed }}
            component={({ chatList, selectedChat }) =>
              chatList.map((chat) => (
                <ChatListLink
                  key={chat._id}
                  chat={chat}
                  urlPrefix={urlPrefix}
                  isSelected={selectedChat?._id === chat._id}
                  onSelectChat={onSelectChat}
                  isCollapsed={isCollapsed}
                />
              ))
            }
            componentProps={{ chatList, selectedChat }}
          />
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
      className={cn(
        "flex items-center justify-between",
        isCollapsed ? "justify-center" : "px-4 pb-3 pt-1",
      )}
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
      <Tooltip key={chat._id} delayDuration={isCollapsed ? 0 : 1000}>
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
              isSelected && "bg-muted",
            )}
            {...props}
          >
            <ChatAvatar name={chat.name} avatar={chat.image} />
            <span className={isCollapsed ? "sr-only" : "min-w-0 truncate"}>
              {chat.name}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{chat.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function ChatListSkeleton({
  isCollapsed,
  ...props
}: { isCollapsed: boolean } & ComponentProps<typeof Skeleton>) {
  return Array.from({ length: 6 }).map((_, index) => (
    <div
      key={index}
      className={cn(
        buttonVariants({
          variant: "ghost",
          size: isCollapsed ? "icon" : "xl",
        }),
        isCollapsed ? "h-16 w-16" : "justify-start gap-4",
      )}
    >
      <Skeleton size="9" layout="icon" {...props} />
      <Skeleton
        size="full"
        className={isCollapsed ? "sr-only" : "shrink"}
        {...props}
      />
    </div>
  ));
}
