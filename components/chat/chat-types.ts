import { Id } from "@/convex/_generated/dataModel";

export type Chat = {
  _id: Id<"chats">;
  name: string;
  image?: string;
};

export type Member = {
  _id: Id<"members">;
  name: string;
  image?: string;
};

export type Invite = {
  _id: Id<"invites">;
  email: string;
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
