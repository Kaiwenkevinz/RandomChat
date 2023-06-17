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
  otherUserAvatarUrl: string;
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
  email: string;
  birthday: string;
  school: string;
  mbti: string;
  avatarUrl: string;
};

export interface User {
  id: number;
  username?: string;
  age?: number;
  avatar_url?: string;
  birthday?: string;
  gender?: string;
  hometown?: string;
  mail?: string;
  major?: string;
  mbti?: string;
  members?: string;
  school?: string;
  telephone_number?: string;
  create_time?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Response<T> {
  status: string;
  msg: string;
  data: T;
}
