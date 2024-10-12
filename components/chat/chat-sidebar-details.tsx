import { ComponentProps } from "react";

import { isAnyLoading } from "@/lib/utils";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatTitle } from "./chat-title";

import { UserPlus } from "../icons";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

const ChatSidebarDetails = () => {
  return (
    <div className="flex flex-col gap-6">
      <ChatSidebarMembers />
      <ChatSidebarInvites />
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
            members.map((m) => (
              <div
                key={m._id}
                className="inline-flex w-full items-center justify-start gap-2"
              >
                <ChatAvatar name={m.name} avatar={m.image} size={6} />
                <span>{m.name}</span>
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
  return Array.from({ length: 6 }).map((_, index) => (
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
    invite: { open: openInviteDialog },
  } = useChatContext();

  const isLoading = isAnyLoading(members, invites);

  return (
    <>
      <ChatTitle
        title="Invites"
        count={invites === "loading" ? invites : invites.length}
        className="text-lg"
      />
      <div className="flex flex-col gap-2">
        <Suspense
          fallbackProps={{ size: 32 }}
          component={({ invites }) =>
            invites.map((i) => (
              <div
                key={i._id}
                className="inline-flex w-full items-center justify-start gap-2"
              >
                <span>{i.email}</span>
              </div>
            ))
          }
          componentProps={{ invites }}
        />
      </div>
      <div className="w-10/12 self-center">
        <Button
          type="button"
          variant="secondary"
          className="flex w-full gap-4"
          onClick={openInviteDialog}
          disabled={isLoading}
        >
          <UserPlus size="4" />
          Send Invite
        </Button>
      </div>
    </>
  );
};

export { ChatSidebarDetails };
