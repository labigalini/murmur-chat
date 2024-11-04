"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { usePathname } from "next/navigation";

import { useConvexAuth, useMutation } from "convex/react";
import { FunctionReturnType } from "convex/server";

import { api } from "@/convex/_generated/api";

import { isProtectedRoute } from "@/lib/utils";

import { useInactivityDetection, useQuery } from "@/hooks";

export type AuthUser = FunctionReturnType<typeof api.users.viewer>;
export type AuthSession = FunctionReturnType<typeof api.auth.session>;

export type AuthContextType = {
  isAuthenticated: boolean | "loading";
  isInactive: boolean;
  user: AuthUser | "loading";
  session: AuthSession | "loading";
};

export const AuthContext = createContext({
  isAuthenticated: false,
  isInactive: false,
  user: "loading",
  session: "loading",
} satisfies AuthContextType as AuthContextType);

export function AuthClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const { isLoading, isAuthenticated } = useConvexAuth();
  const [isInactive, setIsInactive] = useState(false);

  const user = useQuery(
    api.users.viewer, //
    isAuthenticated ? undefined : "skip",
  );
  const session = useQuery(
    api.auth.session,
    isAuthenticated ? undefined : "skip",
  );
  const patchSession = useMutation(api.auth.patchSession);

  useInactivityDetection(
    () => isProtectedRoute(pathname) && setIsInactive(true),
    () => session && void patchSession({ lastUsedTime: Date.now() }),
  );

  const handleContinue = useCallback(async () => {
    await patchSession({ lastUsedTime: Date.now() });
    setIsInactive(false);
  }, [patchSession]);

  const context = useMemo(
    () =>
      ({
        isAuthenticated: isLoading ? "loading" : isAuthenticated,
        isInactive,
        user,
        session,
      }) satisfies AuthContextType,
    [isLoading, isAuthenticated, isInactive, user, session],
  );

  return (
    <AuthContext.Provider value={context}>
      {isInactive ? (
        <InactiveSession onContinue={() => void handleContinue()} />
      ) : (
        <>{children}</>
      )}
    </AuthContext.Provider>
  );
}

function InactiveSession({ onContinue }: { onContinue: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-xl font-semibold">Session Timed Out</h1>
      <p className="text-gray-600">
        Your session has been paused due to inactivity
      </p>
      <button
        onClick={onContinue}
        className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90"
      >
        Continue Session
      </button>
    </div>
  );
}

export const useAuthContext = () => useContext(AuthContext);
