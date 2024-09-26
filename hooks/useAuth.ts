import { useMemo } from "react";

import { useConvexAuth } from "convex/react";

import { api } from "@/convex/_generated/api";

import { useQuery } from "./useQuery";

export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.viewer, isAuthenticated ? undefined : "skip");
  const session = useQuery(
    api.auth.session,
    isAuthenticated ? undefined : "skip",
  );

  const auth = useMemo(
    () => ({
      isAuthenticated: isLoading ? "loading" : isAuthenticated,
      user,
      session,
    }),
    [isLoading, isAuthenticated, user, session],
  );

  return auth;
}
