"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from "react";

type HistoryState =
  // Omit<History, "pushState" | "replaceState"> &
  {
    pushState: (url: string) => void;
    replaceState: (url: string) => void;
  };

const HistoryStateContext = createContext<HistoryState | undefined>(undefined);

export function HistoryStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (e?.state?.requiresReload) window.location.reload();
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const pushState = useCallback((url: string) => {
    window.history.pushState(
      { ...window.history.state, requiresReload: true },
      "",
      url,
    );
  }, []);

  const replaceState = useCallback((url: string) => {
    window.history.replaceState(
      { ...window.history.state, requiresReload: true },
      "",
      url,
    );
  }, []);

  return (
    <HistoryStateContext.Provider value={{ pushState, replaceState }}>
      {children}
    </HistoryStateContext.Provider>
  );
}

export function useHistoryState() {
  const context = useContext(HistoryStateContext);
  if (context === undefined) {
    throw new Error(
      "useHistoryState must be used within a HistoryStateProvider",
    );
  }
  return context;
}
