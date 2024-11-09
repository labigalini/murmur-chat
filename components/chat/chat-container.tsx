"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Optional } from "@/lib/types";
import { cn } from "@/lib/utils";

import ChatBottombar from "./chat-bottombar";
import {
  ChatContextType,
  ChatHandlers,
  ChatProvider,
  ChatState,
} from "./chat-context";
import { ChatList } from "./chat-list";
import { ChatMessageList } from "./chat-message-list";
import ChatSidebar from "./chat-sidebar";
import ChatTopbar from "./chat-topbar";
import { useCookies } from "@/hooks";

import { Suspense } from "../ui/suspense";

type ChatLayoutProps = Omit<ChatState, "urlPrefix" | "viewer"> &
  Optional<Pick<ChatState, "urlPrefix">> & {
    handlers: ChatHandlers;
  };

export function ChatContainer({
  urlPrefix = "/",
  handlers,
  ...initialState
}: ChatLayoutProps) {
  const { cookies, setCookie } = useCookies();

  const [layout, setLayout] = useState<number[]>([320, 480]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (cookies === "loading") return;
    const layoutCookie = cookies.get("react-resizable-panels:layout");
    if (layoutCookie) setLayout(JSON.parse(layoutCookie.value) as number[]);
    const collapsedCookie = cookies.get("react-resizable-panels:collapsed");
    if (collapsedCookie)
      setIsCollapsed(JSON.parse(collapsedCookie.value) as boolean);
  }, [cookies]);

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkScreenWidth();

    // Event listener for screen width changes
    window.addEventListener("resize", checkScreenWidth);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  const viewer = useMemo(() => {
    if (initialState.members === "loading") return "loading";
    const viewers = initialState.members.filter((m) => m.isViewer);
    if (viewers == null)
      throw new Error("There are no viewers in the member list");
    if (viewers.length > 1)
      throw new Error("There are more than one viewer in the member list");
    return viewers[0];
  }, [initialState.members]);

  const chatContext = useMemo(
    () =>
      ({
        state: { ...initialState, viewer, urlPrefix },
        ...handlers,
      }) satisfies ChatContextType,
    [initialState, viewer, urlPrefix, handlers],
  );
  const handleLayoutChange = useCallback(
    (newLayout: number[]) => {
      setLayout(newLayout);
      setCookie("react-resizable-panels:layout", newLayout);
    },
    [setCookie],
  );

  const handleCollapseChange = useCallback(
    (newIsCollapsed: boolean) => {
      setIsCollapsed(newIsCollapsed);
      setCookie("react-resizable-panels:collapsed", newIsCollapsed);
    },
    [setCookie],
  );

  return (
    <ChatProvider value={chatContext}>
      <Suspense
        fallback={() => (
          <div className="flex h-full w-full items-center justify-center">
            <p>Loading...</p>
          </div>
        )}
        component={() => (
          <ResizablePanelGroup
            direction="horizontal"
            onLayout={handleLayoutChange}
            className="h-full items-stretch"
          >
            <ResizablePanel
              defaultSize={layout[0]}
              collapsedSize={8}
              collapsible={true}
              minSize={isMobile ? 0 : 24}
              maxSize={isMobile ? 8 : 50}
              onCollapse={() => handleCollapseChange(true)}
              onExpand={() => handleCollapseChange(false)}
              className={cn(
                isCollapsed &&
                  "min-w-[75px] transition-all duration-300 ease-in-out",
              )}
            >
              <ChatList isCollapsed={isCollapsed || isMobile} />
            </ResizablePanel>
            <ResizableHandle withHandle={!isMobile} disabled={isMobile} />
            <ResizablePanel defaultSize={layout[1]} minSize={30}>
              <div className="relative flex h-full flex-row">
                <div className="flex h-full w-full flex-col justify-between">
                  <ChatTopbar />
                  <ChatMessageList />
                  <ChatBottombar />
                </div>
                <ChatSidebar
                  className={cn(
                    isMobile && "absolute right-0",
                    isMobile ? "max-w-[80%]" : "max-w-96",
                  )}
                />
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
        componentProps={{ cookies }}
      />
    </ChatProvider>
  );
}
