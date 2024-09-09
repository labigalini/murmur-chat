"use client";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { useAuthActions } from "@convex-dev/auth/react";
import {
  AuthLoading,
  Authenticated,
  Unauthenticated,
  useConvexAuth,
} from "convex/react";

import { ThemeToggle } from "@/components/auth/ThemeToggle";
import { toast } from "@/components/ui/use-toast";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      signOut().catch(() => {
        toast({
          title: "Failed to sign out, try again.",
          variant: "destructive",
        });
      });
    }
    setTimeout(() => router.push("/"), 2000);
  }, [isAuthenticated, isLoading, router, signOut]);

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
            <div>Signing you out, hang on tight...</div>
          </AuthLoading>
          <Authenticated>
            <div>Signing you out, hang on tight...</div>
          </Authenticated>
          <Unauthenticated>
            <div>All set, sending you back home...</div>
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
