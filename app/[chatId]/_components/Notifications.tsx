"use client";

import { Fragment } from "react";

import { useMutation, useQuery } from "convex/react";

import { BellIcon } from "@/components/icons";
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

import { handleFailure } from "@/lib/handleFailure";

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
          className="relative h-9 w-9 rounded-full"
        >
          <BellIcon className="h-4 w-4" />
          {(invites ?? []).length > 0 ? (
            <div className="absolute right-[1px] top-[1px] h-2 w-2 rounded-full bg-destructive" />
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
                <span className="font-medium">{invite.inviter}</span> has
                invited you to join{' "'}
                <span className="font-medium">{invite.chat}</span>
                {'"'}. Click to accept.
              </div>
            </DropdownMenuItem>
            {i < invites.length - 1 ? <DropdownMenuSeparator /> : null}
          </Fragment>
        )) ?? <Skeleton className="h-9 w-9" />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
