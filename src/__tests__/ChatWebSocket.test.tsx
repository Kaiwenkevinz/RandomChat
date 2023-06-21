import {renderHook, act, waitFor} from '@testing-library/react-native';

import WS from 'jest-websocket-mock';
import {WEB_SOCKET_URL} from '../constant';
import {useChatWebSocket} from '../hooks/useChatWebSocket';
import {MessagePackReceive} from '../types/network/types';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

it('The mocked WebSocket server should be running', async () => {
  const mockServer = new WS('ws://localhost:1234');
  const client = new WebSocket('ws://localhost:1234');

  await mockServer.connected;
  client.send('hello');
  await expect(mockServer).toReceiveMessage('hello');
  expect(mockServer).toHaveReceivedMessages(['hello']);
});

describe('useWebSocket hook', () => {
  let server: WS;

  beforeEach(async () => {
    server = new WS(WEB_SOCKET_URL);
    new WebSocket(WEB_SOCKET_URL);

    await server.connected;
  });

  afterEach(() => {
    WS.clean();
  });

  it('Once connection established, client sends on connected to server.', async () => {
    renderHook(() => useChatWebSocket());

    await expect(server).toReceiveMessage('WebSocket Client Connected');
    expect(server).toHaveReceivedMessages(['WebSocket Client Connected']);
  });

  it('Client A send message to Server, Server receives and replay the same message back to client.', async () => {
    const mockMessagePack: MessagePackReceive = {
      id: '1a',
      content: 'Hello, my name is Novu',
      send_time: 1684930783,
      sender_id: 'Novu Hangouts',
      receiver_id: 'Kevin',
      isSent: false,
    };

    // mock hook
    const {result} = renderHook(() => useChatWebSocket());
    const clientWebsocket = result.current.websocket;

    // 测试自定义 hook 的功能
    act(() => {
      // 发送 消息包 到 Server
      clientWebsocket.send(mockMessagePack);

      // ack waiting queue 中应该有这个消息包
      expect(messagesAckPendingMemo.has(mockMessagePack.id)).toBeTruthy();
    });

    // Server 收到 Client 发送的消息包
    await expect(server).toReceiveMessage(JSON.stringify(mockMessagePack));

    // Server 发送 WS_EVENT_MSG_ACK 到 Client
    server.send(JSON.stringify(mockServerSendMsgPack));

    // Client 收到消息包 ack，消息包从 ack waiting queue 中移除
    expect(messagesAckPendingMemo.has(mockMessagePack.id)).toBeFalsy();
  });
});
