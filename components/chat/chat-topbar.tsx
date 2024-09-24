import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import {
  ChatSidebarMembers,
  ChatSidebarMembersTitle,
} from "./chat-sidebar-members";

import { InfoCircledIcon } from "../icons";
import { Button } from "../ui/button";

const ChatTopbar = () => {
  const {
    state: { chat },
    sidebar: { open: openSidebar },
  } = useChatContext();

  if (chat === "loading") return "Loading selected chat";
  else if (!chat) return "No chat selected";

  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <ChatAvatar name={chat.name} avatar={chat.image} />
        <div className="flex flex-col">
          <span className="font-medium">{chat.name}</span>
        </div>
      </div>

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="link"
          className="h-9 w-9"
          onClick={() =>
            openSidebar(<ChatSidebarMembersTitle />, <ChatSidebarMembers />)
          }
        >
          <InfoCircledIcon className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};

export default ChatTopbar;
