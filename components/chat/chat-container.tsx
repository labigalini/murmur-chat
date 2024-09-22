"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarContent, setSidebarContent] = useState<{
    title: string;
    content: ReactNode;
  }>({ title: "", content: null });

  const openSidebar = (title: string, content: ReactNode) => {
    setSidebarContent({ title, content });
    setIsSidebarOpen(true);
  };

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
          <ChatList isCollapsed={isCollapsed || isMobile} />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <div className="flex h-full flex-row">
            <div className="flex h-full w-full flex-col justify-between">
              <ChatTopbar openSidebar={openSidebar} />
              <ChatMessageList />
              <ChatBottombar />
            </div>
            <ChatSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              title={sidebarContent.title}
            >
              {sidebarContent.content}
            </ChatSidebar>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ChatProvider>
  );
}
