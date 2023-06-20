import {MessagePack} from '../../types/network/types';
import uuid from 'react-native-uuid';

export const generateMessagePack = (
  type: 'text' | 'image' | 'video' | 'system',
  content: string,
  userId: number,
  otherUserId: number,
) => {
  const res: MessagePack = {
    type,
    id: uuid.v4().toString(),
    content,
    fromId: userId,
    toId: otherUserId,
    isGroup: 0,
    timestamp: Date.now(),
  };

  return res;
};
