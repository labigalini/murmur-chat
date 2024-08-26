"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { UserMenu } from "@/components/auth/UserMenu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { useState } from "react";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);
  const [open, setOpen] = useState(false);

  // const handleSubmit = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
        <SignInForm />
      </DialogContent>
    </Dialog>
  );
}
