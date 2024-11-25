import { ComponentProps, useCallback, useMemo, useState } from "react";

import { Role } from "@/convex/roles";

import { isAnyLoading } from "@/lib/utils";

import { AccessControl } from "./chat-access-control";
import ChatAvatar from "./chat-avatar";
import { useChatContext } from "./chat-context";
import { ChatDialogChangeAvatar } from "./chat-dialog-change-avatar";
import { ChatDialogChangeName } from "./chat-dialog-change-name";
import { ChatInviteDialog } from "./chat-invite-dialog";
import { ChatTitle } from "./chat-title";
import { Invite, Member } from "./chat-types";

import {
  AlertIcon,
  TrashIcon,
  UserPlusIcon,
  UserRoundCogIcon,
  UserRoundXIcon,
} from "../icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogConfirmation,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button, buttonVariants } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "../ui/suspense";

const ChatSidebarDetails = () => {
  const {
    state: { viewer },
  } = useChatContext();

  if (viewer === "loading") return;

  return (
    <div className="flex flex-col gap-4">
      <AccessControl
        viewer={viewer}
        permission="Read Members"
        component={<ChatSidebarMembers />}
      />
      <AccessControl
        viewer={viewer}
        permission="Invite Members"
        component={<ChatSidebarInvites />}
      />
      <AccessControl
        viewer={viewer}
        permission="Manage Chat"
        component={<ChatSidebarConfiguration />}
      />
      <AccessControl
        viewer={viewer}
        permission="Delete Chat"
        component={<ChatSidebarDangerZone />}
      />
    </div>
  );
};

const ChatSidebarMembers = () => {
  const {
    state: { members, viewer },
  } = useChatContext();

  const ownerCount = useMemo(
    () =>
      members == "loading"
        ? 0
        : members.filter((m) => m.role === "Owner").length,
    [members],
  );

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
          component={({ viewer, members }) =>
            members.map((member) => (
              <div key={member._id} className="flex justify-between">
                <div className="flex items-center justify-start gap-2">
                  <ChatAvatar
                    name={member.name}
                    avatar={member.image}
                    size={6}
                  />
                  <span>{member.name}</span>
                  {member.role !== "Member" && (
                    <span className="font-semibold">({member.role})</span>
                  )}
                </div>
                <AccessControl
                  viewer={viewer}
                  permission="Manage Members"
                  component={
                    <div>
                      <ConfigureMemberDialog
                        member={member}
                        ownerCount={ownerCount}
                      />
                      <RemoveMemberDialog
                        member={member}
                        ownerCount={ownerCount}
                      />
                    </div>
                  }
                />
              </div>
            ))
          }
          componentProps={{ viewer, members }}
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
    state: { viewer, invites },
    onRevokeInvite,
  } = useChatContext();

  const [isCreateInviteOpen, setIsCreateInviteOpen] = useState(false);

  const handleRevoke = (invite: Invite) => {
    onRevokeInvite(invite);
  };

  const isLoading = isAnyLoading(viewer, invites);

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
          component={({ viewer, invites }) =>
            invites.map((invite) => (
              <div
                key={invite._id}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span>Email: {invite.email}</span>
                  <span>Inviter: {invite.inviter}</span>
                </div>
                <AccessControl
                  viewer={viewer}
                  permission="Manage Members"
                  component={
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
                          <AlertDialogDescription asChild>
                            <div>
                              <span>
                                This action cannot be undone. This will
                                permanently revoke this invite.
                              </span>
                              <div className="m-4 flex flex-col">
                                <span>Email: {invite.email}</span>
                                <span>Inviter: {invite.inviter}</span>
                              </div>
                            </div>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className={buttonVariants({
                              variant: "destructive",
                            })}
                            onClick={() => handleRevoke(invite)}
                          >
                            Revoke Invite
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  }
                />
              </div>
            ))
          }
          componentProps={{ viewer, invites }}
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

const ChatSidebarConfiguration = () => {
  const {
    state: { chat },
    onLifespanChange,
  } = useChatContext();

  const handleLifespanChange = useCallback(
    (newLifespan: string) => {
      if (chat === null || chat === "loading") return;
      const newLifespanMillis = parseFloat(newLifespan) * 60 * 1000;
      onLifespanChange(chat, newLifespanMillis);
    },
    [chat, onLifespanChange],
  );

  if (chat === null || chat === "loading") return;

  return (
    <>
      <ChatTitle title="Configuration" className="text-lg" />
      <div className="flex flex-col gap-2">
        <div className="mt-2 w-10/12 self-center">
          <ChatDialogChangeName />
        </div>
        <div className="mt-2 w-10/12 self-center">
          <ChatDialogChangeAvatar />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Message Expiration Time</span>
        <Select
          value={`${chat.messageLifespan / 60 / 1000}`}
          onValueChange={handleLifespanChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select an expiration time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 minute</SelectItem>
            <SelectItem value="5">5 minutes</SelectItem>
            <SelectItem value="10">10 minutes</SelectItem>
            <SelectItem value="30">30 minutes</SelectItem>
            <SelectItem value="60">1 hour</SelectItem>
            <SelectItem value="720">12 hours</SelectItem>
            <SelectItem value="1440">24 hours</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-xs text-muted-foreground">
          Messages will be automatically deleted after this time period.
        </span>
      </div>
    </>
  );
};

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
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogConfirmation value={chat.name} />
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

const ConfigureMemberDialog = ({
  member,
  ownerCount,
}: {
  member: Member;
  ownerCount: number;
}) => {
  const { onChangeMemberRole } = useChatContext();

  const [role, setRole] = useState(member.role);

  const handleChangeRole = useCallback(() => {
    onChangeMemberRole(member, role);
  }, [onChangeMemberRole, member, role]);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={member.role === "Owner" && ownerCount < 2}
        asChild
      >
        <Button variant="ghost" size="icon">
          <UserRoundCogIcon size="5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Configure member role</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <span>Choose a new role to assign to the following member.</span>
              <div className="m-4 flex flex-col">
                <span>Member: {member.name}</span>
              </div>
              <Select
                value={role}
                onValueChange={(newRole: Role) => setRole(newRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Owner">Owner</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Member">Member</SelectItem>
                  {/* TODO should use a constant to create these items */}
                </SelectContent>
              </Select>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants()}
            onClick={() => handleChangeRole()}
          >
            Change Role
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const RemoveMemberDialog = ({
  member,
  ownerCount,
}: {
  member: Member;
  ownerCount: number;
}) => {
  const { onRemoveMember } = useChatContext();

  const handleRemove = useCallback(() => {
    onRemoveMember(member);
  }, [onRemoveMember, member]);

  return (
    <AlertDialog>
      <AlertDialogTrigger
        disabled={member.role === "Owner" && ownerCount < 2}
        asChild
      >
        <Button variant="ghost" size="icon">
          <UserRoundXIcon size="5" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div>
              <span>
                This action cannot be undone. This will permanently remove this
                member from the chat.
                <div className="m-4 flex flex-col">
                  <span>Member: {member.name}</span>
                </div>
              </span>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({
              variant: "destructive",
            })}
            onClick={() => handleRemove()}
          >
            Remove Member
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export { ChatSidebarDetails };
