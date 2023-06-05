import {MessagePack} from '../../types/network/types';
import uuid from 'react-native-uuid';

export const generateMessagePack = (
  text: string,
  userId: string,
  otherUserId: string,
) => {
  const res: MessagePack = {
    msgId: uuid.v4().toString(),
    text,
    timestamp: Date.now(),
    sendId: userId,
    receiveId: otherUserId,
    isSent: false,
  };

  return res;
};
