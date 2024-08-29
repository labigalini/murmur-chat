import { cn } from "@/lib/utils";
import { Info, Phone, Video } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import ChatAvatar from "./chat-avatar";
import { Chat } from "./chat-types";

type ChatTopbarProps = Pick<Chat, "name" | "image">;

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatTopbar({ name, image }: ChatTopbarProps) {
  return (
    <div className="w-full h-20 flex p-4 justify-between items-center border-b">
      <div className="flex items-center gap-2">
        <ChatAvatar name={name} avatar={image} />
        <div className="flex flex-col">
          <span className="font-medium">{name}</span>
          <span className="text-xs">Active 2 mins ago</span>
        </div>
      </div>

      <div>
        {TopbarIcons.map((icon, index) => (
          <Link
            key={index}
            href="#"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "h-9 w-9",
              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white",
            )}
          >
            <icon.icon size={20} className="text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}
