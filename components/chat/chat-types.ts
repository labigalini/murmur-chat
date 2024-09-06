export type Chat = {
  _id: string;
  name: string;
  image?: string;
  lastMessageTime?: Date;
};

export type Message = {
  _id: string;
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

export type User = {
  id: number;
  image?: string;
  messages: Message[];
  name: string;
};
