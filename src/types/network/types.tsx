export type MessagePack = {
  type: 'text' | 'image' | 'video' | 'system';
  id: string;
  content: string;
  fromId: number;
  toId: number;
  isGroup: 0 | 1;
  isSent?: boolean;
  timestamp: number;
};

export type ChatComponentProps = {
  otherUserId: number;
  otherUserName: string;
  otherUserAvatarUrl: string;
  messages: MessagePack[];
};

export type GetAllChatMessageResp = {
  rooms: ChatComponentProps[];
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

export interface Result<T = any> {
  status: string; // 服务器返回的约定字段，'ok' | 'error'
  msg: string;
  data: T;
}
