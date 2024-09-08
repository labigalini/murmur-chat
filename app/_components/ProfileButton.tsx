"use client";

import { useCallback, useState } from "react";

import { useRouter } from "next/navigation";

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

import { generateKeyPair, saveKeyPair } from "@/lib/encryption";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleKeyPairGeneration = useCallback(async () => {
    // loading while key is being generated
    // generate key here maybe?
    const keys = await generateKeyPair();
    await saveKeyPair(keys.privateKey, keys.publicKey);
  }, []);

  const handleSignIn = useCallback(() => {
    // loading while key is being generated
    // generate key here maybe?
    setOpen(false);
    router.refresh();
  }, [router, setOpen]);

  const handleSignOut = useCallback(() => {
    router.refresh();
  }, [router]);

  return (
    <>
      <Button
        variant={"secondary"}
        onClick={() => void handleKeyPairGeneration()}
      >
        Test Keys
      </Button>
      <AuthLoading>
        <Skeleton className="h-9 w-9 rounded-full" />
      </AuthLoading>
      <Authenticated>
        <UserMenu
          name={user?.name ?? user?.email ?? user?.phone ?? "Anonymous"}
          avatar={undefined}
          onSignOut={handleSignOut}
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
            <SignInForm onSignIn={handleSignIn} />
          </DialogContent>
        </Dialog>
      </Unauthenticated>
    </>
  );
}
