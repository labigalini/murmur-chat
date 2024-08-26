"use client";

import { handleFailure } from "@/app/(helpers)/handleFailure";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { BellIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery } from "convex/react";
import { Fragment } from "react";

export function Notifications() {
  const invites = useQuery(api.invites.list);
  const acceptInvite = useMutation(api.invites.accept);
  const noInvites = (invites ?? []).length === 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={noInvites}
          variant="secondary"
          size="icon"
          className="rounded-full relative w-9 h-9"
        >
          <BellIcon className="w-4 h-4" />
          {(invites ?? []).length > 0 ? (
            <div className="bg-destructive rounded-full w-2 h-2 absolute top-[1px] right-[1px]" />
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {invites?.map((invite, i) => (
          <Fragment key={invite._id}>
            <DropdownMenuItem
              onSelect={handleFailure(() =>
                acceptInvite({ inviteId: invite._id }),
              )}
            >
              <div>
                <span className="font-medium">{invite.inviterEmail}</span> has
                invited you to join{" "}
                <span className="font-medium">{invite.chat}</span>. Click to
                accept.
              </div>
            </DropdownMenuItem>
            {i < invites.length - 1 ? <DropdownMenuSeparator /> : null}
          </Fragment>
        )) ?? <Skeleton className="w-9 h-9" />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
