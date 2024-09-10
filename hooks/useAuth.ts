import { useMemo } from "react";

import { useConvexAuth } from "convex/react";

import { api } from "@/convex/_generated/api";

import { useQuery } from "./useQuery";

export function useAuth() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.viewer, isAuthenticated ? undefined : "skip");

  const auth = useMemo(
    () => ({
      isAuthenticated,
      user: user === "loading" ? null : user,
    }),
    [isAuthenticated, user],
  );

  return isLoading || user === "loading" ? "loading" : auth;
}
