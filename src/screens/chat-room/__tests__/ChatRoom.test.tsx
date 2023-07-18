import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../../../network/axios.config';
import {API_GET_MESSAGE_HISTORY} from '../../../network/constant';
import {mockLogin, mockMessageHistory} from '../../../network/mocks/mockData';
import {chatService} from '../../../network/lib/message';
import {store} from '../../../store/store';
import {
  appendNewChatRoom,
  getMessageHistoryAsync,
} from '../../../store/chat/chatSlice';

describe('聊天信息分页接口', () => {
  let mock: MockAdapter;
  beforeAll(() => {});
  beforeEach(() => {
    mock = new MockAdapter(axiosClient);
  });
  afterEach(() => {
    mock.reset();
  });

  test(`通过 page 和 size 参数, 返回对应的分页数据`, async () => {
    mock
      .onPost(API_GET_MESSAGE_HISTORY)
      .reply(200, mockMessageHistory.mockResponse);

    const otherUserId = 300;
    const resp = await chatService.getMessageHistory(otherUserId, 1, 10);

    expect(resp).toEqual({});
  });

  test(`后端返回的分页数据 should 添加到 store 的对应的聊天室中`, async () => {
    mock
      .onPost(API_GET_MESSAGE_HISTORY)
      .reply(200, mockMessageHistory.mockResponse);

    const otherUserId = 300;
    const otherUserName = 'Random User';
    const otherUserAvatarUrl = 'http://localhost:3000/300.png';
    // 生成新聊天室
    store.dispatch(
      appendNewChatRoom({otherUserId, otherUserName, otherUserAvatarUrl}),
    );
    // should 有一个聊天室
    expect(store.getState().chat.data.length).toEqual(1);
    // 聊天室 id should be otherUserId
    expect(store.getState().chat.data[0].otherUserId).toEqual(otherUserId);

    // 分页获取聊天消息
    const page = 1;
    const size = 10;
    await store.dispatch(
      getMessageHistoryAsync({otherUserId, page, pageSize: size}),
    );

    // 应该有10条消息
    expect(store.getState().chat.data[0].messages.length).toEqual(10);
  });
});
