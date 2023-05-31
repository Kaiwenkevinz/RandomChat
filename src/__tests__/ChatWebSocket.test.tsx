// import renderer from 'react-test-renderer';
// import {renderHook, act} from '@testing-library/react';
import {renderHook, act, waitFor} from '@testing-library/react-native';

import WS from 'jest-websocket-mock';
import {WEB_SOCKET_URL, WS_EVENT_MSG_ACK} from '../constant';
import {
  WebSocketMessagePackType,
  useChatWebSocket,
} from '../hooks/useChatWebSocket';
import {MessageType} from '../types/network/types';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

it('The mocked WebSocket server should be running', async () => {
  const server = new WS('ws://localhost:1234');
  const client = new WebSocket('ws://localhost:1234');

  await server.connected;
  client.send('hello');
  await expect(server).toReceiveMessage('hello');
  expect(server).toHaveReceivedMessages(['hello']);
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
    renderHook(() => useChatWebSocket(() => {}));

    await expect(server).toReceiveMessage('WebSocket Client Connected');
    expect(server).toHaveReceivedMessages(['WebSocket Client Connected']);
  });

  it('Client A send message to Server, Server receives and replay ack back.', async () => {
    /**
     * Once connect to server, client send 'WebSocket Client Connected'
     * Client send message pack to server
     * message pack is in waiting ack queue
     * server should recieve the message pack
     * server send 'ws_event_msg_ack' with the message pack back to client
     * message pack is removed from waiting ack queue
     * client should recieve 'ws_event_msg_ack' and log '消息发送成功'
     */

    const mockMessagePack: MessageType = {
      msgId: '1a',
      text: 'Hello, my name is Novu',
      time: 1684930783,
      userSend: 'Novu Hangouts',
      userReceive: 'Kevin',
    };

    const mockServerSendMsgPack: WebSocketMessagePackType = {
      eventType: WS_EVENT_MSG_ACK,
      messagePack: mockMessagePack,
    };

    // mock hook
    const {result} = renderHook(() =>
      useChatWebSocket(async (wsMsgPack: WebSocketMessagePackType) => {
        // Client 收到 消息包，并且消息包包含了发送成功的状态，消息发送成功
        await expect(wsMsgPack).toStrictEqual(mockServerSendMsgPack);
      }),
    );

    const messagesAckPendingMemo = result.current.messagesAckPendingMemo;

    // 连接建立, Client 发送 'WebSocket Client Connected'
    await expect(server).toReceiveMessage('WebSocket Client Connected');

    // 测试自定义 hook 的功能
    act(() => {
      // 发送 消息包 到 Server
      result.current.sendWebSocketMessage(mockMessagePack);

      // ack waiting queue 中应该有这个消息包
      expect(messagesAckPendingMemo.has(mockMessagePack.msgId)).toBeTruthy();
    });

    // Server 收到 Client 发送的消息包
    await expect(server).toReceiveMessage(JSON.stringify(mockMessagePack));

    // Server 发送 WS_EVENT_MSG_ACK 到 Client
    server.send(JSON.stringify(mockServerSendMsgPack));

    // Client 收到消息包 ack，消息包从 ack waiting queue 中移除
    expect(messagesAckPendingMemo.has(mockMessagePack.msgId)).toBeFalsy();
  });
});
