import Link from "next/link";

import { cn } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";

import { InfoCircledIcon } from "../icons";
import { buttonVariants } from "../ui/button";

interface ChatTopbarProps {
  openSidebar: (title: string, content: React.ReactNode) => void;
}

const ChatTopbar: React.FC<ChatTopbarProps> = ({ openSidebar }) => {
  const {
    state: { chat, members },
  } = useChatContext();

  if (chat === "loading") return "Loading selected chat";
  else if (!chat) return "No chat selected";

  if (members === "loading") return "Loading members";

  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <ChatAvatar name={chat.name} avatar={chat.image} />
        <div className="flex flex-col">
          <span className="font-medium">{chat.name}</span>
        </div>
      </div>

      <div className="flex gap-1">
        <Link
          href="#"
          onClick={() =>
            openSidebar(
              "Chat Settings",
              <p>
                Members: {members.length}
                <br />
                {members.map((m) => m.name).join(", ")}
              </p>,
            )
          }
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "h-9 w-9",
          )}
        >
          <InfoCircledIcon className="h-6 w-6" />
        </Link>
      </div>
      {/* 
      <button
        onClick={() => openSidebar("Chat Settings", <ChatSettings />)}
        className="rounded-full p-2 hover:bg-gray-200"
      >
        Settings
      </button>
      <button
        onClick={() => openSidebar("Chat Info", <ChatInfo />)}
        className="rounded-full p-2 hover:bg-gray-200"
      >
        Info
      </button>
      <button
        onClick={() => openSidebar("Chat Test", <p>test</p>)}
        className="rounded-full p-2 hover:bg-gray-200"
      >
        Test
      </button> 
      */}
    </div>
  );
};

export default ChatTopbar;
