export type MessagePack = {
  msgId: string;
  text: string;
  timestamp: number;
  sendId: string;
  receiveId: string;
  isSent: boolean;
};

export type ChatComponentProps = {
  otherUserId: string;
  messages: MessagePack[];
};

export type GetAllChatMessageResp = {
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
