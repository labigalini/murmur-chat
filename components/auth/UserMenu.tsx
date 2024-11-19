import { useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { UserSettingsDialog } from "./UserSettingsDialog";

import { ThemeToggle } from "../layout/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserMenuProps {
  name: string;
  avatar?: string;
}

export function UserMenu({ name, avatar }: UserMenuProps) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <UserSettingsDialog
        name={name}
        avatar={avatar}
        open={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar className="flex items-center justify-center">
              <AvatarImage src={avatar} alt={name} width={6} height={6} />
              <AvatarFallback>{name}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => setIsSettingsOpen(true)}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="flex items-center gap-2 py-0 font-normal">
            Theme
            <ThemeToggle />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/logout">Sign out</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
