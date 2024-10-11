import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import {
  ChatSidebarMembers,
  ChatSidebarMembersTitle,
} from "./chat-sidebar-members";

import { InfoCircledIcon, UserPlus } from "../icons";
import { Button } from "../ui/button";
import { Suspense } from "../ui/suspense";

const ChatTopbar = () => {
  const {
    state: { chat },
    sidebar: { open: openSidebar },
    invite: { open: openInviteDialog },
  } = useChatContext();

  if (!chat) return "No chat selected";

  const isLoading = chat === "loading";

  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <div className="flex items-center gap-4">
        <Suspense
          fallbackProps={{ size: 9, layout: "icon" }}
          component={({ chat }) => (
            <ChatAvatar name={chat.name} avatar={chat.image} />
          )}
          componentProps={{ chat }}
        />
        <Suspense
          fallbackProps={{ size: 32 }}
          component={({ chat }) => (
            <span className="font-medium">{chat.name}</span>
          )}
          componentProps={{ chat }}
        />
      </div>
      <div className="flex gap-1">
        <Button
          size="icon"
          variant="link"
          className="h-9 w-9"
          onClick={openInviteDialog}
          disabled={isLoading}
        >
          <UserPlus size="6" />
        </Button>
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
