import { Info, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatAvatarProps {
  name?: string;
  avatar?: string;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatAvatar({ name, avatar }: ChatAvatarProps) {
  return (
    <Avatar className="flex items-center justify-center">
      <AvatarImage src={avatar} alt={name} width={6} height={6} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
