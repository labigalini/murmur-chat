import { Id } from "@/convex/_generated/dataModel";
import { Role } from "@/convex/roles";

export type Chat = {
  _id: Id<"chats">;
  name: string;
  image?: string;
};

export type Member = {
  _id: Id<"members">;
  name: string;
  image?: string;
  role: Role;
};

export type Invite = {
  _id: Id<"invites">;
  email: string;
  inviter: string;
  role: Role;
  // permissions: Permission[];
};

export type Message = {
  _id: Id<"messages">;
  _creationTime: number;
  _expirationTime: number;
  text: string;
  author: {
    _id: string;
    name: string;
    image?: string;
  };
  isViewer: boolean;
};
