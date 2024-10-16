"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Command } from "cmdk";

import { SearchIcon } from "@/components/icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { api } from "@/convex/_generated/api";

import { cn } from "@/lib/utils";

import { useQuery } from "@/hooks";

const CommandMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const chats = useQuery(api.chats.list);

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSelectChat = useCallback(
    (newSelection: string) => {
      router.push(newSelection);
      setOpen(false);
    },
    [router],
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="px-0 py-3">
        <DialogTitle className="sr-only">Chat Search</DialogTitle>
        <Command loop>
          <Command.Input asChild>
            <Input
              icon={<SearchIcon size="5" />}
              placeholder="Chat Search"
              className="border-none text-xl outline-none focus-visible:ring-0"
            />
          </Command.Input>
          <Command.List className="mt-2 border-t-2 px-2 pb-2 pt-3">
            <Command.Empty>No results found.</Command.Empty>
            {chats === "loading" ? (
              <Command.Loading>Hang on…</Command.Loading>
            ) : (
              chats.map((chat) => (
                <Command.Item
                  key={chat._id}
                  value={chat.name}
                  onSelect={() => handleSelectChat(chat._id)}
                  className={cn(
                    "flex h-10 cursor-pointer items-center rounded-sm px-4",
                    "data-[selected=true]:bg-muted",
                  )}
                >
                  {chat.name}
                </Command.Item>
              ))
            )}
          </Command.List>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export { CommandMenu };
