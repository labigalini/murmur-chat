export type Chat = {
  _id: string;
  name: string;
  image?: string;
  lastMessageTime?: Date;
};

export type Message = {
  _id: string;
  text: string;
  author?: string;
  authorImage?: string;
};

export type User = {
  id: number;
  image?: string;
  messages: Message[];
  name: string;
};
