export type Chat = {
  _id: string;
  name: string;
  image?: string;
  lastMessageTime?: Date;
};

export type Message = {
  id: number;
  avatar?: string;
  name: string;
  message: string;
};

export type User = {
  id: number;
  avatar: string;
  messages: Message[];
  name: string;
};
