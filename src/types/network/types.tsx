export type MessagePack = {
  msgId: string;
  text: string;
  timestamp: number;
  sendId: string;
  receiveId: string;
  isSent?: boolean;
};

export type ChatComponentProps = {
  otherUserId: string;
  messages: MessagePack[];
};

export type GetAllChatMessageResp = {
  rooms: ChatComponentProps[];
};

export type UserInfo = {
  id: string;
  username: string;
};

export type UserProfile = {
  gender: string;
  age: string;
  hometown: string;
  major: string;
  contactNumber: string;
  birthday: string;
  school: string;
  mbti: string;
};

export type LoginResponse = {
  jwt: string;
  user: UserInfo;
};
