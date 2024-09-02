import { Info, Phone, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatAvatarProps {
  name?: string;
  avatar?: string;
}

export const TopbarIcons = [{ icon: Phone }, { icon: Video }, { icon: Info }];

export default function ChatAvatar({ name, avatar }: ChatAvatarProps) {
  return (
    <Avatar className="flex justify-center items-center">
      <AvatarImage
        src={avatar ?? `https://avatar.vercel.sh/${name}.png`}
        alt={name ?? "?"}
        width={6}
        height={6}
      />
      <AvatarFallback>{(name ?? "?")[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
