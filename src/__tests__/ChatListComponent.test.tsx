import renderer from 'react-test-renderer';
import React from 'react';
import {ChatListComponent} from '../components/ChatListComponent';
import {WEB_SOCKET_URL} from '../constant';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ChatListComponent
        roomId="1"
        otherUserName="Jade"
        user={{id: 'usr1', username: 'Kevin'}}
        websocket={new WebSocket(WEB_SOCKET_URL)}
        messages={[
          {
            msgId: '1',
            text: 'Hello',
            timestamp: 1627777777777,
            sendId: 'Jade',
            receiveId: 'Kevin',
            isSent: false,
          },
        ]}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
