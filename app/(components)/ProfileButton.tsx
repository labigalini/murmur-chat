"use client";

import { ErrorBoundary } from "@/app/(helpers)/ErrorBoundary";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { ClerkLoading, SignedIn, SignedOut } from "@clerk/nextjs";

export function ProfileButton() {
  return (
    <ErrorBoundary>
      <ClerkLoading>
        <Skeleton className="rounded-full w-8 h-8" />
      </ClerkLoading>
      <SignedIn>
        <div className="w-8 h-8">
          <UserButton afterSignOutUrl="/" />
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex gap-4 animate-[fade-in_0.2s]">
          <SignInButton mode="modal">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Sign up</Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </ErrorBoundary>
  );
}
