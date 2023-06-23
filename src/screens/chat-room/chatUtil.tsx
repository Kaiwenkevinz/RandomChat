import {IMessagePackReceive, MessagePackSend} from '../../types/network/types';
import uuid from 'react-native-uuid';

export const generateSendMessagePack = (
  content: string,
  userId: number,
  otherUserId: number,
  type: 'text' | 'image' | 'video' | 'system' = 'text',
) => {
  const res: MessagePackSend = {
    type: type,
    id: uuid.v4().toString(),
    content,
    fromId: userId,
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
  type: 'text' | 'image' | 'video' | 'system' = 'text',
  isGroup: 0 | 1 = 0,
) => {
  const res: IMessagePackReceive = {
    id,
    message_type: type,
    content,
    sender_id: userId,
    receiver_id: otherUserId,
    isSent: false,
    send_time: new Date().toISOString(),
    isGroup,
  };

  return res;
};
