// import renderer from 'react-test-renderer';
// import {renderHook, act} from '@testing-library/react';
import {renderHook, act, waitFor} from '@testing-library/react-native';

import WS from 'jest-websocket-mock';
import {WEB_SOCKET_URL} from '../constant';
import {useChatWebSocket} from '../hooks/useChatWebSocket';

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
  it('Once onOpen, client sends msg to server.', async () => {
    const server = new WS(WEB_SOCKET_URL);

    renderHook(() => useChatWebSocket());

    await server.connected;

    await expect(server).toReceiveMessage('WebSocket Client Connected');
    expect(server).toHaveReceivedMessages(['WebSocket Client Connected']);
  });
});
