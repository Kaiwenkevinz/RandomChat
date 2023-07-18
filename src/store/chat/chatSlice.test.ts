import {axiosClient} from '../../network/axios.config';
import {store} from '../store';
import {IChatRoom, IMessagePackReceive} from '../../types/network/types';
import MockAdapter from 'axios-mock-adapter';
import {
  appendNewChatRoom,
  appendNewMessage,
  getChatsAsync,
  reset,
  updateMessageStatus,
} from './chatSlice';
import {API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES} from '../../network/constant';
import {
  generateMockChatMessage,
  mockAllFriendAllChatMessages,
} from '../../network/mocks/mockData';
import {generateReceiveMessagePack} from '../../screens/chat-room/chatUtil';

// TODO: 像这种共享 mock data 的写法，如果 test case 用到了其他文件的 mock data，下面的 test case 又共享 mock data，这样的话，如果 mock data 变了，下面的 test case 拿到的 mock data 也会变，不太好
const chatRoomData: IChatRoom[] =
  mockAllFriendAllChatMessages.mockResponse.data;

const mockApiResponse = () => {
  const mock = new MockAdapter(axiosClient);
  mock
    .onPost(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
    .reply(200, mockAllFriendAllChatMessages.mockResponse);
};

describe('Redux chat reducer', () => {
  beforeAll(() => {
    mockApiResponse();
  });

  beforeEach(() => {
    store.dispatch(reset());
  });

  it('初始状态聊天信息为空', () => {
    const state = store.getState();
    expect(state.chat).toStrictEqual({
      data: [],
      status: 'idle',
    });
  });

  it('获取聊天信息并更新 store', async () => {
    await store.dispatch(getChatsAsync());
    const chatState = store.getState().chat;
    chatRoomData[1].otherUserAvatarUrl =
      'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg';
    expect(chatState).toStrictEqual({
      status: 'idle',
      data: chatRoomData,
    });
  });

  it('should append 新消息到对应的聊天室', async () => {
    await store.dispatch(getChatsAsync());

    const newMessage: IMessagePackReceive = generateMockChatMessage(
      '2a',
      'new message content',
    );

    // 根据 otherUserId 找到对应的聊天室
    store.dispatch(appendNewMessage(newMessage));

    // push 新消息到聊天室
    const temp = [...chatRoomData[0].messages];
    temp.push(newMessage);

    expect(store.getState().chat.data[0].messages[2].id).toStrictEqual('2a');
  });

  xit('should 更新消息发送状态为已发送', async () => {
    // await store.dispatch(getChatsAsync());
    // // 消息刚发送，isSent 为 false
    // const newMessageJustSend = generateReceiveMessagePack(
    //   'test-1',
    //   'new message content',
    //   1,
    //   200,
    // );
    // store.dispatch(appendNewMessage(newMessageJustSend));
    // let messages = store.getState().chat.data[0].messages;
    // let newMessage = messages[messages.length - 1];
    // // 消息刚发送，isSent 为 false
    // expect(newMessage.isSent).toBe(false);
    // // 消息发送成功，isSent 为 undefined, 代表已发送
    // store.dispatch(updateMessageStatus({otherUserId: 200, msgId: 'test-1'}));
    // messages = store.getState().chat.data[0].messages;
    // newMessage = messages[messages.length - 1];
    // expect(newMessage).not.toHaveProperty('isSent');
  });

  it('should 新增一个聊天室', () => {
    const newChatRoom = {
      otherUserId: 100,
      otherUserAvatarUrl:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Young_girl_smiling_in_sunshine_%282%29.jpg/1200px-Young_girl_smiling_in_sunshine_%282%29.jpg',
      otherUserName: 'Jade',
    };
    // chat room length should be 0
    expect(store.getState().chat.data.length).toBe(0);

    store.dispatch(appendNewChatRoom(newChatRoom));
    // chat room length should be 1
    expect(store.getState().chat.data.length).toBe(1);

    store.dispatch(appendNewChatRoom(newChatRoom));
    // chat room length should still be 1
    expect(store.getState().chat.data.length).toBe(1);
  });
});
