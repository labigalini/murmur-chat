import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface ChatAvatarProps {
  name?: string;
  avatar?: string;
  size?: number;
}

export default function ChatAvatar({ name, avatar, size }: ChatAvatarProps) {
  return (
    <Avatar className="flex items-center justify-center" size={size}>
      <AvatarImage src={avatar} alt={name} />
      <AvatarFallback>{name}</AvatarFallback>
    </Avatar>
  );
}
