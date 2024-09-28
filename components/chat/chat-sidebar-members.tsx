import { ComponentProps } from "react";

import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatTitle } from "./chat-title";

import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

const ChatSidebarMembersTitle = () => {
  const {
    state: { members },
  } = useChatContext();

  if (members === "loading") return "Loading members title";

  return (
    <ChatTitle title="Members" count={members.length} className="text-xl" />
  );
};

const ChatSidebarMembers = () => {
  const {
    state: { members },
  } = useChatContext();

  return (
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
      <Skeleton size="full" className={"shrink"} {...props} />
    </div>
  ));
}

export { ChatSidebarMembers, ChatSidebarMembersTitle };
