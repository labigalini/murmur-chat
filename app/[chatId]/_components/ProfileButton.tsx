"use client";

import { useCallback } from "react";

import Link from "next/link";

import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";

import { UserMenu } from "@/components/auth/UserMenu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/convex/_generated/api";

import { generateKeyPair, saveKeyPair } from "@/lib/encryption";

import { useQuery } from "@/hooks";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);

  const handleKeyPairGeneration = useCallback(async () => {
    // loading while key is being generated
    // generate key here maybe?
    const keys = await generateKeyPair();
    await saveKeyPair(keys.privateKey, keys.publicKey);
  }, []);

  return (
    <>
      <Button
        variant="secondary"
        onClick={() => void handleKeyPairGeneration()}
      >
        Test Keys
      </Button>
      <AuthLoading>
        <Skeleton className="h-9 w-9 rounded-full" />
      </AuthLoading>
      <Authenticated>
        {user && user !== "loading" ? (
          <UserMenu name={user.name} avatar={user.image} />
        ) : (
          <Skeleton className="h-9 w-9 rounded-full" />
        )}
      </Authenticated>
      <Unauthenticated>
        <Link href="/login" className={buttonVariants()}>
          Sign In
        </Link>
      </Unauthenticated>
    </>
  );
}
