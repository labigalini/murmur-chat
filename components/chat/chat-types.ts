export type Chat = {
  _id: string;
  name: string;
  image?: string;
};

export type Member = {
  _id: string;
  name: string;
  image?: string;
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
