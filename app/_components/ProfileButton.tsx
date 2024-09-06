"use client";

import { useState } from "react";

import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";

import { DialogTitle } from "@radix-ui/react-dialog";

import { SignInForm } from "@/components/auth/SignInForm";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/convex/_generated/api";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);
  const [open, setOpen] = useState(false);

  // const handleSubmit = () => setOpen(false);

  return (
    <>
      <AuthLoading>
        <Skeleton className="h-9 w-9 rounded-full" />
      </AuthLoading>
      <Authenticated>
        <UserMenu
          name={user?.name ?? user?.email ?? user?.phone ?? "Anonymous"}
          avatar={undefined}
        />
      </Authenticated>
      <Unauthenticated>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Sign In</Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-semibold tracking-tight">
                Sign in or create an account
              </DialogTitle>
            </DialogHeader>
            <SignInForm onSignIn={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </Unauthenticated>
    </>
  );
}
