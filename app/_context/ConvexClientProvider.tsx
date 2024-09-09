"use client";

import { ReactNode } from "react";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";

import { ErrorBoundary } from "@/components/helpers/ErrorBoundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <>{children}</>
      </ConvexAuthProvider>
    </ErrorBoundary>
  );
}
