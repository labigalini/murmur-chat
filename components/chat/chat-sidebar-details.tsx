import { ComponentProps, useCallback, useState } from "react";

import { isAnyLoading } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatInviteDialog } from "./chat-invite-dialog";
import { ChatTitle } from "./chat-title";
import { Invite } from "./chat-types";

import { AlertIcon, TrashIcon, UserPlusIcon } from "../icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

const ChatSidebarDetails = () => {
  return (
    <div className="flex flex-col gap-4">
      <ChatSidebarMembers />
      <ChatSidebarInvites />
      <ChatSidebarDangerZone />
    </div>
  );
};

const ChatSidebarMembers = () => {
  const {
    state: { members },
  } = useChatContext();

  return (
    <>
      <ChatTitle
        title="Members"
        count={members === "loading" ? members : members.length}
        className="text-lg"
      />
      <div className="flex flex-col gap-2">
        <Suspense
          fallback={ChatSidebarMembersSkeleton}
          component={({ members }) =>
            members.map((member) => (
              <div
                key={member._id}
                className="inline-flex w-full items-center justify-start gap-2"
              >
                <ChatAvatar name={member.name} avatar={member.image} size={6} />
                <span>{member.name}</span>
              </div>
            ))
          }
          componentProps={{ members }}
        />
      </div>
    </>
  );
};

function ChatSidebarMembersSkeleton({
  ...props
}: ComponentProps<typeof Skeleton>) {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="inline-flex w-full items-center justify-start gap-2"
    >
      <Skeleton size="6" layout="icon" {...props} />
      <Skeleton size="32" className={"shrink"} {...props} />
    </div>
  ));
}

const ChatSidebarInvites = () => {
  const {
    state: { members, invites },
    onRevokeInvite,
  } = useChatContext();

  const [isCreateInviteOpen, setIsCreateInviteOpen] = useState(false);

  const handleRevoke = (invite: Invite) => {
    onRevokeInvite(invite);
  };

  const isLoading = isAnyLoading(members, invites);

  return (
    <>
      <ChatInviteDialog
        open={isCreateInviteOpen}
        onClose={() => setIsCreateInviteOpen(false)}
      />
      <ChatTitle
        title="Invites"
        count={invites === "loading" ? invites : invites.length}
        className="text-lg"
      />
      <div className="flex flex-col gap-2">
        <Suspense
          fallback={ChatSidebarInvitesSkeleton}
          component={({ invites }) =>
            invites.map((invite) => (
              <div
                key={invite._id}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span>Email: {invite.email}</span>
                  <span>Inviter: {invite.inviter}</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <TrashIcon size="5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        revoke this invite.
                        <div className="m-4 flex flex-col">
                          <span>Email: {invite.email}</span>
                          <span>Inviter: {invite.inviter}</span>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: "destructive" })}
                        onClick={() => handleRevoke(invite)}
                      >
                        Revoke Invite
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))
          }
          componentProps={{ invites }}
        />
      </div>
      <div className="mt-2 w-10/12 self-center">
        <Button
          type="button"
          variant="secondary"
          className="flex w-full gap-4"
          onClick={() => setIsCreateInviteOpen(true)}
          disabled={isLoading}
        >
          <UserPlusIcon size="4" />
          Send Invite
        </Button>
      </div>
    </>
  );
};

function ChatSidebarInvitesSkeleton({
  ...props
}: ComponentProps<typeof Skeleton>) {
  return Array.from({ length: 3 }).map((_, index) => (
    <div
      key={index}
      className="inline-flex w-full items-center justify-start gap-2"
    >
      <Skeleton className={"h-8 w-48 shrink"} {...props} />
    </div>
  ));
}

const ChatSidebarDangerZone = () => {
  const {
    state: { chat },
    sidebar: { close: closeSidebar },
    onDeleteChat,
  } = useChatContext();

  const handleDeleteChat = useCallback(() => {
    if (chat === null || chat === "loading") return;
    onDeleteChat(chat);
    closeSidebar();
  }, [chat, closeSidebar, onDeleteChat]);

  if (chat === null || chat === "loading") return;

  return (
    <>
      <ChatTitle title="Danger Zone" className="text-lg" />
      <div className="mt-2 w-10/12 self-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="destructive"
              className="flex w-full gap-4"
            >
              <AlertIcon size="5" />
              Delete this chat
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                chat and remove all associated data.
                <div className="m-4 flex flex-col">
                  <span>Chat: {chat.name}</span>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={handleDeleteChat}
              >
                Delete Chat
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </>
  );
};

export { ChatSidebarDetails };