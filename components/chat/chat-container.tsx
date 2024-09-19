"use client";

import { useEffect, useMemo, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { Optional } from "@/lib/types";
import { cn } from "@/lib/utils";

import {
  ChatContextType,
  ChatHandlers,
  ChatProvider,
  ChatState,
} from "./chat-context";
import { ChatMain } from "./chat-main";
import { ChatSidebar } from "./chat-sidebar";

type ChatLayoutProps = Omit<ChatState, "urlPrefix"> &
  Optional<Pick<ChatState, "urlPrefix">> & {
    defaultLayout?: number[];
    defaultCollapsed?: boolean;
    navCollapsedSize?: number;
    handlers: ChatHandlers;
  };

export function ChatContainer({
  urlPrefix = "/",
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize = 8,
  handlers,
  ...initialState
}: ChatLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [isMobile, setIsMobile] = useState(false);

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

  const chatContext = useMemo(
    () =>
      ({
        state: { ...initialState, urlPrefix },
        ...handlers,
      }) satisfies ChatContextType,
    [initialState, urlPrefix, handlers],
  );

  return (
    <ChatProvider value={chatContext}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes: number[]) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes,
          )}`;
        }}
        className="h-full items-stretch"
      >
        <ResizablePanel
          defaultSize={defaultLayout[0]}
          collapsedSize={navCollapsedSize}
          collapsible={true}
          minSize={isMobile ? 0 : 24}
          maxSize={isMobile ? 8 : 50}
          onCollapse={() => {
            setIsCollapsed(true);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              true,
            )}`;
          }}
          onExpand={() => {
            setIsCollapsed(false);
            document.cookie = `react-resizable-panels:collapsed=${JSON.stringify(
              false,
            )}`;
          }}
          className={cn(
            isCollapsed &&
              "min-w-[75px] transition-all duration-300 ease-in-out",
          )}
        >
          <ChatSidebar isCollapsed={isCollapsed || isMobile} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <ChatMain />
        </ResizablePanel>
      </ResizablePanelGroup>
    </ChatProvider>
  );
}
