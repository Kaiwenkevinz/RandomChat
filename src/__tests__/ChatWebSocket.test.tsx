import WS from 'jest-websocket-mock';
import {handleOnReceiveWebSocketMessage} from '../hooks/useChatWebSocket';
import {generateSendMessagePack} from '../screens/chat-room/chatUtil';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {store} from '../store/store';
import {getChatsAsync} from '../store/chatSlice';
import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../network/axios.config';
import {API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES} from '../network/constant';
import {mockAllFriendAllChatMessages} from '../network/mocks/mockData';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

describe('通过 Websocket 发送和接收聊天消息', () => {
  let mockServer: WS;

  beforeEach(async () => {
    mockServer = new WS('ws://localhost:1234');
    WebSocketSingleton.initWebsocket('ws://localhost:1234', 'fake-token');

    await mockServer.connected;
  });

  afterEach(() => {
    WS.clean();
    WebSocketSingleton.closeAndReset();
  });

  it('The mocked WebSocket server should be running', async () => {
    const client = WebSocketSingleton.getWebsocket();

    await mockServer.connected;
    client?.send('hello');
    await expect(mockServer).toReceiveMessage('hello');
    expect(mockServer).toHaveReceivedMessages(['hello']);
  });

  it('Server 收到消息体后 should 返回消息体给 Client', async () => {
    const otherUserId = 200;
    const userId = 1;
    const content = 'Hello, 这是个测试消息';
    const mockMessagePackSend = generateSendMessagePack(
      content,
      userId,
      otherUserId,
    );

    WebSocketSingleton.getWebsocket()?.send(
      JSON.stringify(mockMessagePackSend),
    );

    // Server 收到 Client 发送的消息包
    await expect(mockServer).toReceiveMessage(
      JSON.stringify(mockMessagePackSend),
    );
  });

  it('Server push 新消息到 Client 后 should 触发 onMessage 回调, 并新增新消息到对应的聊天室', async () => {
    // 初始化 client
    const userId = 1;
    const client = WebSocketSingleton.getWebsocket();
    if (!client) {
      throw new Error('client is null');
    }
    client.onmessage = (event: WebSocketMessageEvent) => {
      handleOnReceiveWebSocketMessage(userId, event);
      console.log('event.data', event.data);
    };

    // 获取已有聊天记录
    const mock = new MockAdapter(axiosClient);
    mock
      .onPost(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
      .reply(200, mockAllFriendAllChatMessages.mockResponse);
    await store.dispatch(getChatsAsync());

    // 第一个聊天室的消息数量应该为 4
    let firstChatRoom = store.getState().chat.data[0];
    expect(firstChatRoom.messages.length).toBe(4);

    // 模拟用户 200 给用户 1 发送消息
    const fromId = 200;
    const toId = userId;
    const content = 'Hello, 这是个来自服务器的测试消息';
    const mockMessagePackSend = generateSendMessagePack(content, fromId, toId);
    mockServer.send(JSON.stringify(mockMessagePackSend));

    // 第一个聊天室的消息数量应该为 5
    firstChatRoom = store.getState().chat.data[0];
    expect(firstChatRoom.messages.length).toBe(5);
  });
});
