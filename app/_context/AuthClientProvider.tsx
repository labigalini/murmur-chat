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

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

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

  const handleInactiveSession = useCallback(
    () => isProtectedRoute(pathname) && setIsInactive(true),
    [pathname],
  );

  const handleActiveSession = useCallback(
    () => isAuthenticated && void patchSession({ lastUsedTime: Date.now() }),
    [patchSession, isAuthenticated],
  );

  useInactivityDetection(handleInactiveSession, handleActiveSession);

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
    <div className="bg-gradient flex min-h-screen items-center justify-center">
      <div className="flex flex-col gap-4 rounded-3xl border bg-background p-8 text-center shadow-xl">
        <h1 className="text-2xl font-bold">Session Timed Out</h1>
        <p className="text-gray-600">
          Your session has been paused due to inactivity
        </p>
        <Separator className="my-2" />
        <Button onClick={onContinue}>Continue Session</Button>
      </div>
    </div>
  );
}

export const useAuthContext = () => useContext(AuthContext);
