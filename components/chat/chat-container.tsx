"use client";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { ChatContextType, ChatHandlers, ChatProvider } from "./chat-context";
import { ChatMain } from "./chat-main";
import { Sidebar } from "./chat-sidebar";
import { Chat } from "./chat-types";

interface ChatLayoutProps {
  chats: Chat[];
  selectedChat?: Chat;
  defaultLayout?: number[];
  defaultCollapsed?: boolean;
  navCollapsedSize?: number;
  handlers: ChatHandlers;
}

export function ChatContainer({
  chats = [],
  selectedChat,
  defaultLayout = [320, 480],
  defaultCollapsed = false,
  navCollapsedSize = 8,
  handlers,
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
        state: { selectedChat: selectedChat?._id ?? "" }, // FIXME
        ...handlers,
      }) satisfies ChatContextType,
    [selectedChat, handlers],
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
          maxSize={isMobile ? 8 : 30}
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
              "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out",
          )}
        >
          <Sidebar
            isCollapsed={isCollapsed || isMobile}
            links={chats.map((chat) => ({
              name: chat.name,
              image: chat.image,
              variant: selectedChat?._id === chat._id ? "grey" : "ghost",
            }))}
            isMobile={isMobile}
          />
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          {selectedChat ? (
            <ChatMain chat={selectedChat} messages={[]} isMobile={isMobile} />
          ) : (
            <>No Chat Selected</>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </ChatProvider>
  );
}
