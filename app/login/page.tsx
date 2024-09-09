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
import { ThemeToggle } from "@/components/auth/ThemeToggle";
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
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="flex w-full flex-col items-center justify-center pt-6 lg:hidden">
        <h1 className="text-gradient mb-2 text-4xl font-bold">murmur.chat</h1>
        <p className="text-xs font-light italic">No eavesdroppers, ever.</p>
      </div>
      <div className="bg-gradient hidden flex-col items-center justify-center p-12 lg:flex lg:w-1/2">
        <div className="text-white">
          <h1 className="mb-4 text-5xl font-bold tracking-tight">
            murmur.chat
          </h1>
          <p className="text-xl font-light italic">No eavesdroppers, ever.</p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2 lg:pt-36">
        <div className="w-full max-w-md">
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
        </div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute bottom-4 right-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
