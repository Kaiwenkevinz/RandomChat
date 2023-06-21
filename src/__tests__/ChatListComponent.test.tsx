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
            id: '1',
            content: 'Hello',
            send_time: 1627777777777,
            sender_id: 'Jade',
            receiver_id: 'Kevin',
            isSent: false,
          },
        ]}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
