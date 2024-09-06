"use client";

import { ReactNode } from "react";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";

import { useMediaQuery } from "usehooks-ts";

import { ErrorBoundary } from "@/components/helpers/ErrorBoundary";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const _prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  return (
    <ErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <ConvexProvider client={convex}>
          <>{children}</>
        </ConvexProvider>
      </ConvexAuthProvider>
    </ErrorBoundary>
  );
}
