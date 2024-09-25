"use client";

import Link from "next/link";

import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";

import { UserMenu } from "@/components/auth/UserMenu";
import { buttonVariants } from "@/components/ui/button";
import { Hesitate } from "@/components/ui/hesitate";
import { Skeleton } from "@/components/ui/skeleton";

import { api } from "@/convex/_generated/api";

import { useQuery } from "@/hooks";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);

  return (
    <>
      <AuthLoading>
        <Skeleton className="h-9 w-9 rounded-full" />
      </AuthLoading>
      <Authenticated>
        <Hesitate
          size={9}
          component={({ user }) => (
            <UserMenu name={user.name} avatar={user.image} />
          )}
          props={{ user }}
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
