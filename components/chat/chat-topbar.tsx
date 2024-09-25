import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import {
  ChatSidebarMembers,
  ChatSidebarMembersTitle,
} from "./chat-sidebar-members";

import { InfoCircledIcon } from "../icons";
import { Button } from "../ui/button";
import { Hesitate } from "../ui/hesitate";

const ChatTopbar = () => {
  const {
    state: { chat },
    sidebar: { open: openSidebar },
  } = useChatContext();

  if (!chat) return "No chat selected";

  const isLoading = chat === "loading";

  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <Hesitate
          size="9"
          component={({ chat }) => (
            <ChatAvatar name={chat.name} avatar={chat.image} />
          )}
          props={{ chat }}
        />
        <Hesitate
          component={({ chat }) => (
            <span className="font-medium">{chat.name}</span>
          )}
          props={{ chat }}
        />
      </div>

      <div className="flex gap-1">
        <Button
          size="icon"
          variant="link"
          className="h-9 w-9"
          onClick={() =>
            openSidebar(<ChatSidebarMembersTitle />, <ChatSidebarMembers />)
          }
          disabled={isLoading}
        >
          <InfoCircledIcon size="6" />
        </Button>
      </div>
    </div>
  );
};

export default ChatTopbar;
