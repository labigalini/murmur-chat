import { useChatContext } from "./chat-context";

import { Cross2Icon } from "../icons";
import { Button } from "../ui/button";

const ChatSidebar = () => {
  const {
    sidebar: { title, content, isOpen, close },
  } = useChatContext();

  if (!isOpen) return null;

  return (
    <div className="h-full w-full border-l p-4">
      <div className="mb-4 flex items-center justify-between">
        <>{title}</>
        <Button variant="ghost" size="icon" onClick={close}>
          <Cross2Icon size="5" />
        </Button>
      </div>
      <div className="overflow-y-auto">
        <>{content}</>
      </div>
    </div>
  );
};

export default ChatSidebar;
