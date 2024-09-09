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
    <>
      <AuthLoading>
        <div>Signing you out, hang on tight...</div>
      </AuthLoading>
      <Authenticated>
        <div>Signing you out, hang on tight...</div>
      </Authenticated>
      <Unauthenticated>
        <div>All set, sending you back home...</div>
      </Unauthenticated>
    </>
  );
}
