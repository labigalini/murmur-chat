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
import { ChatCreateDialog } from "./chat-create-dialog";

interface SidebarProps {
  isCollapsed: boolean;
  links: {
    name: string;
    image?: string;
    variant: "grey" | "ghost";
  }[];
  isMobile: boolean;
}

export function Sidebar({ isCollapsed, links }: SidebarProps) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);

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
            <span className="text-zinc-300">({links.length})</span>
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
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16",
                      link.variant === "grey" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
                    )}
                  >
                    <ChatAvatar name={link.name} avatar={link.image} />{" "}
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: link.variant, size: "xl" }),
                link.variant === "grey" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                "justify-start gap-4 min-w-0",
              )}
            >
              <ChatAvatar name={link.name} avatar={link.image} />
              <div className="flex flex-col max-w-28 min-w-0">
                <span>{link.name}</span>
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
