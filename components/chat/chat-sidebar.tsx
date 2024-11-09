import { cn } from "@/lib/utils";

import { useChatContext } from "./chat-context";
import { ChatTitle } from "./chat-title";

import { Cross2Icon } from "../icons";
import { Button } from "../ui/button";

type ChatSidebarProps = React.HTMLAttributes<HTMLDivElement>;

const ChatSidebar: React.FC<ChatSidebarProps> = ({ className, ...props }) => {
  const {
    sidebar: { title, content, isOpen, close },
  } = useChatContext();

  if (!isOpen) return null;

  return (
    <div
      className={cn("h-full w-full border-l bg-background", className)}
      {...props}
    >
      <div className="flex items-center justify-between p-4">
        {typeof title === "string" ? (
          <ChatTitle title={title} className="text-xl" />
        ) : (
          title
        )}
        <Button variant="ghost" size="icon" onClick={close}>
          <Cross2Icon size="5" />
        </Button>
      </div>
      <div className="overflow-auto px-4">
        <>{content}</>
      </div>
    </div>
  );
};

export default ChatSidebar;
