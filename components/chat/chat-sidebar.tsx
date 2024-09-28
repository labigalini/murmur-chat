import { cn } from "@/lib/utils";

import { useChatContext } from "./chat-context";

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
      className={cn("h-full w-full border-l bg-background p-4", className)}
      {...props}
    >
      <div className="mb-4 flex items-center justify-between">
        <>{title}</>
        <Button variant="ghost" size="icon" onClick={close}>
          <Cross2Icon size="5" />
        </Button>
      </div>
      <div className="overflow-auto">
        <>{content}</>
      </div>
    </div>
  );
};

export default ChatSidebar;
