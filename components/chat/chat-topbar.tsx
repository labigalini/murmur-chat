import Link from "next/link";

import { Info, Phone, Video } from "lucide-react";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { Chat } from "./chat-types";

import { buttonVariants } from "../ui/button";

type ChatTopbarProps = Pick<Chat, "name" | "image">;

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({ name, image }: ChatTopbarProps) {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-2">
        <ChatAvatar name={name} avatar={image} />
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div className="flex gap-1">
        {TopbarIcons.map((icon, index) => (
          <Link
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
            )}
          >
            <icon.icon size={20} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
