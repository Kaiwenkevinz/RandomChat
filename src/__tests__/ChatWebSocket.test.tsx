// import renderer from 'react-test-renderer';
import {renderHook} from '@testing-library/react';

import WS from 'jest-websocket-mock';
import {WEB_SOCKET_URL} from '../constant';
import {useChatWebSocket} from '../hooks/useChatWebsocket';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

it('the server keeps track of received messages, and yields them as they come in', async () => {
  const server = new WS('ws://localhost:1234');
  const client = new WebSocket('ws://localhost:1234');

  await server.connected;
  client.send('hello');
  await expect(server).toReceiveMessage('hello');
  expect(server).toHaveReceivedMessages(['hello']);
});

/**
 * @jest-environment jsdom
 */
test('useWebSocket hook', async () => {
  const server = new WS(WEB_SOCKET_URL);

  renderHook(() => useChatWebSocket());

  await server.connected;

  await expect(server).toReceiveMessage('WebSocket Client Connected');
  expect(server).toHaveReceivedMessages(['WebSocket Client Connected']);
});
