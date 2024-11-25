import { cn } from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatAvatarProps {
  name?: string;
  avatar?: string;
  size?: number;
  className?: string;
}

export default function ChatAvatar({
  name,
  avatar,
  size,
  className,
}: ChatAvatarProps) {
  return (
    <Avatar
      className={cn("flex items-center justify-center", className)}
      size={size}
    >
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
