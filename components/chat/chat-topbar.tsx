import Link from "next/link";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { Chat } from "./chat-types";

import { InfoCircledIcon } from "../icons";
import { buttonVariants } from "../ui/button";

type ChatTopbarProps = Pick<Chat, "name" | "image">;

export default function ChatTopbar({ name, image }: ChatTopbarProps) {
  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <ChatAvatar name={name} avatar={image} />
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
        </div>
      </div>

      <div className="flex gap-1">
        <Link
          href="#"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
          )}
        >
          <InfoCircledIcon className="h-5 w-5 text-muted-foreground" />
        </Link>
      </div>
    </div>
  );
}
