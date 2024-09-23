import React, { ReactNode } from "react";

import { Cross2Icon } from "../icons";
import { Button } from "../ui/button";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="h-full w-full border-l p-4">
      <div className="mb-4 flex items-center justify-between">
        {title}
        <Button variant="ghost" size="icon" onClick={onClose}>
          <Cross2Icon className="h-5 w-5" />
        </Button>
      </div>
      <div className="overflow-y-auto">{children}</div>
    </div>
  );
};

export default ChatSidebar;
