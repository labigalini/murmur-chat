"use client";

import Link from "next/link";

import { AuthLoading, Authenticated, Unauthenticated } from "convex/react";

import { UserMenu } from "@/components/auth/UserMenu";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "@/components/ui/suspense";

import { api } from "@/convex/_generated/api";

import { useQuery } from "@/hooks";

export function ProfileButton() {
  const user = useQuery(api.users.viewer);

  return (
    <>
      <AuthLoading>
        <Skeleton size="9" layout="icon" />
      </AuthLoading>
      <Authenticated>
        <Suspense
          fallbackProps={{ size: 9, layout: "icon" }}
          component={({ user }) => (
            <UserMenu name={user.name} avatar={user.image} />
          )}
          componentProps={{ user }}
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
