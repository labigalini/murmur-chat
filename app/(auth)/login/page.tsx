"use client";

import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";

import { SignInForm } from "@/components/auth/SignInForm";
import { buttonVariants } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();

  // TODO get the redirect URL to send back to previous chat
  const [redirect, _setRedirect] = useState("/chatid-placeholder");

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) setTimeout(() => router.push(redirect), 2000);
  }, [isAuthenticated, isLoading, redirect, router]);

  return (
    <>
      <AuthLoading>
        <div>Verifying authentication, hang on tight...</div>
      </AuthLoading>
      <Authenticated>
        <div>All set, sending you back to {redirect}...</div>
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
        <div className="mx-auto mt-8 max-w-[384px] border-t pt-6 text-center">
          <Link
            href="/"
            className={buttonVariants({
              variant: "ghost",
              className: "text-sm",
            })}
          >
            ← Back to Home
          </Link>
        </div>
      </Unauthenticated>
    </>
  );
}
