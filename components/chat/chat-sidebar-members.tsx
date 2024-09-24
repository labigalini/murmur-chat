import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatTitle } from "./chat-title";

const ChatSidebarMembersTitle = () => {
  const {
    state: { members },
  } = useChatContext();

  if (members === "loading") return "Loading members title";

  return <ChatTitle title="Members" count={members.length} size="xl" />;
};

const ChatSidebarMembers = () => {
  const {
    state: { members },
  } = useChatContext();

  if (members === "loading") return "Loading members content";

  return (
    <div className="flex flex-col gap-2">
      {members.map((m) => (
        <div
          key={m._id}
          className="inline-flex w-full items-center justify-start gap-2"
        >
          <ChatAvatar name={m.name} avatar={m.image} size={6} />
          <span>{m.name}</span>
        </div>
      ))}
    </div>
  );
};

export { ChatSidebarMembers, ChatSidebarMembersTitle };
