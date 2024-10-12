import { useState } from "react";

import { isAnyLoading } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatInviteDialog } from "./chat-invite-dialog";
import { ChatSidebarDetails } from "./chat-sidebar-details";

import { InfoCircledIcon, UserPlusIcon } from "../icons";
import { Button } from "../ui/button";
import { Suspense } from "../ui/suspense";

const ChatTopbar = () => {
  const {
    state: { chat },
    sidebar: { open: openSidebar },
  } = useChatContext();

  const [isCreateInviteOpen, setIsCreateInviteOpen] = useState(false);

  if (!chat) return "No chat selected";

  const isLoading = isAnyLoading(chat);

  return (
    <div className="flex h-20 w-full items-center justify-between border-b p-4">
      <ChatInviteDialog
        open={isCreateInviteOpen}
        onClose={() => setIsCreateInviteOpen(false)}
      />
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
          onClick={() => setIsCreateInviteOpen(true)}
          disabled={isLoading}
        >
          <UserPlusIcon size="6" />
        </Button>
        <Button
          size="icon"
          variant="link"
          className="h-9 w-9"
          onClick={() => openSidebar("Chat Details", <ChatSidebarDetails />)}
          disabled={isLoading}
        >
          <InfoCircledIcon size="6" />
        </Button>
      </div>
    </div>
  );
};

export default ChatTopbar;
