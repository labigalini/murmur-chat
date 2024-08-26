"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import { useMediaQuery } from "usehooks-ts";
import { ErrorBoundary } from "./ErrorBoundary";

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
