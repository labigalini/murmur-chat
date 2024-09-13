import { ReactNode } from "react";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

export function ConvexServerProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexAuthNextjsServerProvider>
      <>{children}</>
    </ConvexAuthNextjsServerProvider>
  );
}
