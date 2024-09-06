import { useRouter } from "next/navigation";

import { useAuthActions } from "@convex-dev/auth/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ThemeToggle } from "./ThemeToggle";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface UserMenuProps {
  name: string;
  avatar?: string;
}

export function UserMenu({ name, avatar }: UserMenuProps) {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
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
          <DropdownMenuLabel className="flex items-center gap-2 py-0 font-normal">
            Theme
            <ThemeToggle />
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <SignOutButton />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SignOutButton() {
  const router = useRouter();
  const { signOut } = useAuthActions();

  return (
    <DropdownMenuItem
      onClick={() => void signOut().then(() => router.push("/"))}
    >
      Sign out
    </DropdownMenuItem>
  );
}
