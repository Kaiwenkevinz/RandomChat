import {IMessagePackReceive, MessagePackSend} from '../../types/network/types';
import uuid from 'react-native-uuid';

export const generateSendMessagePack = (
  content: string,
  userId: number,
  userAvatarUrl: string,
  userName: string,
  otherUserId: number,
  type: 'text' | 'image' | 'video' | 'system' = 'text',
) => {
  const res: MessagePackSend = {
    type: type,
    id: uuid.v4().toString(),
    content,
    fromId: userId,
    sender_name: userName,
    sender_avatar_url: userAvatarUrl,
    toId: otherUserId,
    isGroup: 0,
  };

  return res;
};

export const generateReceiveMessagePack = (
  id: string,
  content: string,
  userId: number,
  otherUserId: number,
  otherUserAvatarUrl: string,
  otherUserName: string,
  type: 'text' | 'image' | 'video' | 'system' = 'text',
  isGroup: 0 | 1 = 0,
  isSent: boolean = false,
) => {
  const res: IMessagePackReceive = {
    id,
    message_type: type,
    content,
    sender_id: userId,
    sender_name: otherUserName,
    sender_avatar_url: otherUserAvatarUrl,
    receiver_id: otherUserId,
    isSent,
    send_time: new Date().toISOString(),
    isGroup,
  };

  return res;
};
