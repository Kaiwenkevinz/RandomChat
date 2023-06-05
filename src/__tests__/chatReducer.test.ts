import {axiosClient} from '../network/axios.config';
import {store} from '../store/store';
import {GetAllChatMessageResp, MessagePack} from '../types/network/types';
import MockAdapter from 'axios-mock-adapter';
import {ChatState, appendNewMessage, getChatsAsync} from '../store/chatSlice';

const getAllChatResponse: GetAllChatMessageResp = {
  rooms: [
    {
      roomId: 'room_1',
      otherUserId: 'Novu Hangouts',
      messages: [
        {
          msgId: '1a',
          text: 'Hello, my name is Novu',
          timestamp: 1684930783,
          sendId: 'Novu Hangouts',
          receiveId: 'Kevin',
          isSent: false,
        },
      ],
    },
  ],
};

const mockNetworkResponse = () => {
  const mock = new MockAdapter(axiosClient);
  mock.onGet(`/all_chat_messages`).reply(200, getAllChatResponse);
};

describe('chat slice', () => {
  beforeAll(() => {
    mockNetworkResponse();
  });

  it('should init state to empty rooms and idle status', () => {
    const state = store.getState();
    expect(state.chat).toStrictEqual({
      rooms: [],
      status: 'idle',
    });
  });

  it('should fetch all chat messages and update state', async () => {
    const action = getChatsAsync();
    await store.dispatch(action);
    const correctState: ChatState = {
      ...{status: 'idle'},
      ...getAllChatResponse,
    };

    expect(store.getState().chat).toStrictEqual(correctState);
  });

  it('should append a new message to the corresponding chat room', async () => {
    // 加一个消息到聊天室
    await store.dispatch(getChatsAsync());

    const newMessage: MessagePack = {
      msgId: '1b',
      text: 'This is a new message from Kevin',
      timestamp: 1685930783,
      sendId: 'Kevin',
      receiveId: 'Novu Hangouts',
      isSent: false,
    };

    store.dispatch(appendNewMessage(newMessage));

    expect(store.getState().chat).toStrictEqual({
      status: 'idle',
      rooms: [
        {
          roomId: 'room_1',
          otherUserId: 'Novu Hangouts',
          messages: [
            {
              msgId: '1a',
              text: 'Hello, my name is Novu',
              timestamp: 1684930783,
              sendId: 'Novu Hangouts',
              receiveId: 'Kevin',
              isSent: false,
            },
            {
              msgId: '1b',
              text: 'This is a new message from Kevin',
              timestamp: 1685930783,
              sendId: 'Kevin',
              receiveId: 'Novu Hangouts',
              isSent: false,
            },
          ],
        },
      ],
    });
  });
});
