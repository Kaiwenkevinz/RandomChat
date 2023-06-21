import {generateSendMessagePack} from '../chatUtil';

describe('ChatRoom test', () => {
  it('should generate a message pack', () => {
    const text = 'Hello World!';
    const userId = 'Kevin';
    const otherUserId = 'Novu Hangouts';
    const messagePack = generateSendMessagePack(text, userId, otherUserId);

    const messageObjToCompare = {
      msgId: expect.any(String),
      text,
      timestamp: expect.any(Number),
      sendId: userId,
      receiveId: otherUserId,
      isSent: false,
    };
    expect(messagePack).toStrictEqual(messageObjToCompare);
  });
});
