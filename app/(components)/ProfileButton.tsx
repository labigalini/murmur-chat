"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { DialogTitle } from "@radix-ui/react-dialog";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { useState } from "react";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);
  const [open, setOpen] = useState(false);

  // const handleSubmit = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <AuthLoading>
        <Skeleton className="rounded-full w-9 h-9" />
      </AuthLoading>
      <Authenticated>
        <UserMenu
          name={user?.name ?? user?.email ?? user?.phone ?? "Anonymous"}
          avatar={undefined}
        />
      </Authenticated>
      <Unauthenticated>
        <DialogTrigger asChild>
          <Button>Sign In</Button>
        </DialogTrigger>
      </Unauthenticated>

      <DialogContent>
        <DialogTitle />
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}