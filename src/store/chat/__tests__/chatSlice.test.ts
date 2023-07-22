import {createAction} from '@reduxjs/toolkit';
import server from '../../../services/jest/server';
import {store} from '../../store';
import {generateReceiveMessagePack} from '../../../screens/chat-room/chatUtil';
import {
  IReadRoom,
  appendNewChatRoom,
  appendNewMessage,
  updateMessageStatus,
} from '../chatSlice';
import {getChatsAsync, updateReadRooms} from '../thunks/getChatsAsyncThunk';
import {setupChatHandlers} from '../mock-data/chatHandlers';
import {IChatRoom} from '../../../types/network/types';

describe('Redux chat slice', () => {
  beforeAll(() => server.listen());
  afterAll(() => server.close());
  beforeEach(() => {
    // given
    setupChatHandlers();
  });
  afterEach(() => {
    // clean up store after each test
    const resetAction = createAction('reset');
    store.dispatch(resetAction());
  });

  describe('receive a new message', () => {
    it('should create a new chat room if the room does not exist yet, then append the message to the chat room', () => {
      // given
      // create a new message pack
      const otherUserId = 2;
      const messagePack = generateReceiveMessagePack(
        'msg-1',
        'i am message content',
        otherUserId,
        1,
        '',
        'Sender',
      );

      // when
      // dispatch the action to add message to store
      store.dispatch(appendNewMessage(messagePack));

      // then
      // store should have one chat room
      expect(store.getState().chat.data.length).toEqual(1);
      // store should have the corresponding chat room and message
      expect(store.getState().chat.data[0].otherUserId).toEqual(otherUserId);
    });

    it('should append the message to the chat room if the chat room already exists', () => {
      // given
      // store already has a chat room
      const otherUserId = 2;
      const messagePack = generateReceiveMessagePack(
        'msg-1',
        'i am message content',
        otherUserId,
        1,
        '',
        'Sender',
      );

      // when
      // dispatch the action to add message to store
      store.dispatch(appendNewMessage(messagePack));
      // store should have one chat room
      expect(store.getState().chat.data.length).toEqual(1);
      // store should have the corresponding chat room and message
      expect(store.getState().chat.data[0].otherUserId).toEqual(otherUserId);

      // create a new message pack corresponding to the chat room
      const messagePackTwo = generateReceiveMessagePack(
        'msg-2',
        'i am message content',
        1,
        otherUserId,
        '',
        'Sender',
      );

      // when
      // dispatch the action to add message
      store.dispatch(appendNewMessage(messagePackTwo));

      // then
      // store should have one chat room and the chat room should have two messages
      expect(store.getState().chat.data.length).toEqual(1);
      expect(store.getState().chat.data[0].messages.length).toEqual(2);
    });
  });

  describe('update the status of whether the message has been sent', () => {
    it('should mark the status of the message as sent', () => {
      // given
      // create a new message pack that has not been sent yet
      const otherUserId = 1;
      const msgId = 'msg-1';
      const messagePack = generateReceiveMessagePack(
        msgId,
        'i am message content',
        otherUserId,
        1,
        '',
        'Sender',
      );
      store.dispatch(appendNewMessage(messagePack));

      // This message has not been sent yet
      expect(store.getState().chat.data[0].messages[0].isSent).toEqual(false);

      // when
      // dispatch the action to update the status of the message
      store.dispatch(updateMessageStatus({otherUserId, msgId}));

      // then
      // store should have the message with the status updated
      expect(store.getState().chat.data[0].messages[0]).not.toHaveProperty(
        'isSent',
      );
    });

    it('should not change the existing state when there is no such message, and show console log warning', () => {
      // given
      // mock console.warn function
      const consoleSpy = jest
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      // create a new message pack that has not been sent yet
      const otherUserId = 1;
      const msgId = 'msg-1';
      const messagePack = generateReceiveMessagePack(
        msgId,
        'i am message content',
        otherUserId,
        1,
        '',
        'Sender',
      );
      store.dispatch(appendNewMessage(messagePack));

      // This message has not been sent yet
      expect(store.getState().chat.data[0].messages[0].isSent).toEqual(false);

      // when
      // dispatch the action to update the status of the message
      store.dispatch(updateMessageStatus({otherUserId: 123, msgId}));

      // then
      // there should be a warning in the console
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockReset();
    });
  });

  describe('create a new chat room', () => {
    it('should create a new chat room if the room does not exist yet', () => {
      // given
      const params = {
        otherUserId: 200,
        otherUserName: 'just a name',
        otherUserAvatarUrl: '',
      };

      // when
      store.dispatch(appendNewChatRoom(params));

      // then
      expect(store.getState().chat.data.length).toEqual(1);
      expect(store.getState().chat.data[0].otherUserId).toEqual(200);
    });

    it('should not do anything if the chat room already exists', () => {
      // given
      const params = {
        otherUserId: 200,
        otherUserName: 'just a name',
        otherUserAvatarUrl: '',
      };

      // when
      store.dispatch(appendNewChatRoom(params));

      expect(store.getState().chat.data.length).toEqual(1);

      store.dispatch(appendNewChatRoom(params));

      // then
      expect(store.getState().chat.data.length).toEqual(1);
    });
  });

  describe('fetch chat list and update read status of them', () => {
    it('should give a default avatar url if the other user does not have one', async () => {
      // when
      await store.dispatch(getChatsAsync());

      // then
      expect(store.getState().chat.data[1].otherUserAvatarUrl).toEqual(
        'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg',
      );
    });

    it('should keep the avatar url of the other user if the other user already has an avatar url', async () => {
      // when
      await store.dispatch(getChatsAsync());

      // then
      expect(store.getState().chat.data[0].otherUserAvatarUrl).toEqual(
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
      );
    });

    it('should remove the chat room from ReadRoom array if the newest message id of this chat room is different from the one in the ReadRoom array', () => {
      // given
      // mock console.log
      const consoleSpy = jest
        .spyOn(console, 'log')
        .mockImplementation(() => {});
      // construct fetched rooms with room id 100(msg1-1) and 200(msg2-2)
      const fetchedRooms: IChatRoom[] = [
        {
          otherUserId: 100,
          otherUserName: 'friend one',
          otherUserAvatarUrl: '',
          total: 1,
          messages: [
            {
              id: 'msg1-1',
              sender_id: 100,
              message_type: 'text',
              isGroup: 0,
              content: '',
              sender_avatar_url: '',
              sender_name: '',
              receiver_id: 1,
              send_time: '',
            },
          ],
        },
        {
          otherUserId: 200,
          otherUserName: 'friend Two',
          otherUserAvatarUrl: '',
          total: 2,
          messages: [
            {
              id: 'msg2-1',
              sender_id: 200,
              message_type: 'text',
              isGroup: 0,
              content: '',
              sender_avatar_url: '',
              sender_name: '',
              receiver_id: 1,
              send_time: '',
            },
            {
              id: 'msg2-2',
              sender_id: 200,
              message_type: 'text',
              isGroup: 0,
              content: '',
              sender_avatar_url: '',
              sender_name: '',
              receiver_id: 1,
              send_time: '',
            },
          ],
        },
      ];
      // construct read rooms with room id 100(msg1-1) and 200(msg2-1)
      const readRooms: IReadRoom[] = [
        {
          roomId: 100,
          msgId: 'msg1-1',
        },
        {
          roomId: 200,
          msgId: 'msg2-1',
        },
      ];

      // when
      updateReadRooms(fetchedRooms, readRooms);

      // then
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockReset();
    });
  });
});
