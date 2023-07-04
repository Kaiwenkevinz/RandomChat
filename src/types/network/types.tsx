export type MessagePackSend = {
  type: 'text' | 'image' | 'video' | 'system';
  id: string;
  content: string;
  fromId: number;
  sender_name: string;
  sender_avatar_url: string;
  toId: number;
  isGroup: 0 | 1;
};

export type IMessagePackReceive = {
  message_type: 'text' | 'image' | 'video' | 'system';
  id: string;
  content: string;
  sender_id: number;
  sender_avatar_url: string;
  sender_name: string;
  receiver_id: number;
  isGroup: 0 | 1;
  send_time: string;
  isSent?: boolean;
};

export type IChatRoom = {
  otherUserId: number;
  otherUserName: string;
  otherUserAvatarUrl: string | null;
  messages: IMessagePackReceive[];
};

export interface IScoreResponse {
  userId: number;
  score: number;
}

export interface IScoreMap {
  [id: number]: number;
}

export interface IUser {
  id: number;
  role?: string; // 标签
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

export interface ILoginResponse {
  token: string;
  user: IUser;
}

export interface Result<T = any> {
  status: string; // 服务器返回的约定字段，'ok' | 'error'
  msg: string;
  data: T;
}
