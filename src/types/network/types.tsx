export type MessageType = {
  msgId: string;
  text: string;
  time: number;
  userSend: string;
  userReceive: string;
};

export type ChatComponentProps = {
  roomId: string;
  otherUser: string;
  messages: MessageType[];
};

export type GetRoomsResponse = {
  rooms: ChatComponentProps[];
};
