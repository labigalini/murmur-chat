"use client";

import { useEffect, useMemo } from "react";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";

import { SignInForm } from "@/components/auth/SignInForm";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading, isAuthenticated } = useConvexAuth();

  const redirectUrl = useMemo(
    () => searchParams.get("redirect") ?? "/",
    [searchParams],
  );

  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    setTimeout(() => router.push(redirectUrl), 2000);
  }, [isAuthenticated, isLoading, redirectUrl, router]);

  return (
    <div className="max-w-[384px]">
      <AuthLoading>
        <div>Verifying authentication, hang on tight...</div>
      </AuthLoading>
      <Authenticated>
        <div>All set, sending you back to {redirectUrl}...</div>
      </Authenticated>
      <Unauthenticated>
        <SignInForm />
        <Separator className="my-4" />
        <div className="mx-auto text-center">
          <Link
            href="/"
            className={buttonVariants({
              variant: "link",
              className: "text-sm",
            })}
          >
            ← Back to Home
          </Link>
        </div>
      </Unauthenticated>
    </div>
  );
}
