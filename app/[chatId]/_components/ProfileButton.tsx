"use client";

import { useCallback } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";

import { UserMenu } from "@/components/auth/UserMenu";
import { Button, buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/convex/_generated/api";

import { generateKeyPair, saveKeyPair } from "@/lib/encryption";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);
  const router = useRouter();

  const handleKeyPairGeneration = useCallback(async () => {
    // loading while key is being generated
    // generate key here maybe?
    const keys = await generateKeyPair();
    await saveKeyPair(keys.privateKey, keys.publicKey);
  }, []);

  const handleSignOut = useCallback(() => {
    router.push("/");
  }, [router]);

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
        <UserMenu
          name={user?.name ?? user?.email ?? user?.phone ?? "Anonymous"}
          avatar={undefined}
          onSignOut={handleSignOut}
        />
      </Authenticated>
      <Unauthenticated>
        <Link href="/login" className={buttonVariants()}>
          Sign In
        </Link>
      </Unauthenticated>
    </>
  );
}
