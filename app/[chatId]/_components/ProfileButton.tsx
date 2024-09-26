"use client";

import Link from "next/link";

import { Unauthenticated } from "convex/react";

import { UserMenu } from "@/components/auth/UserMenu";
import { buttonVariants } from "@/components/ui/button";
import { Suspense } from "@/components/ui/suspense";

import { useAuth } from "@/hooks";

export function ProfileButton() {
  // const user = useQuery(api.users.viewer);
  const { user } = useAuth();

  return (
    <>
      <Suspense
        skipFallbackOnEmpty
        fallbackProps={{ size: 9, layout: "icon" }}
        component={({ user }) => (
          <UserMenu name={user.name} avatar={user.image} />
        )}
        componentProps={{ user }}
      />
      <Unauthenticated>
        <Link href="/login" className={buttonVariants()}>
          Sign In
        </Link>
      </Unauthenticated>
    </>
  );
}
