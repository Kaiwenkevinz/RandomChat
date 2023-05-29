export type MessageType = {
  msgId: string;
  text: string;
  time: number;
  userSend: string;
  userReceive: string;
};

export type ChatComponentProps = {
  roomId: string;
  otherUserName: string;
  messages: MessageType[];
};

export type GetRoomsResponse = {
  rooms: ChatComponentProps[];
};

export type User = {
  id: string;
  username: string;
};

export type LoginResponse = {
  jwt: string;
  user: User;
};
