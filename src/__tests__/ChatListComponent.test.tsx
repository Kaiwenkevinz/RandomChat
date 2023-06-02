import renderer from 'react-test-renderer';
import React from 'react';
import {ChatListComponent} from '../components/ChatListComponent';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));

it('renders correctly', () => {
  const tree = renderer
    .create(
      <ChatListComponent
        roomId="1"
        otherUserId="Jade"
        user={{id: 'usr1', username: 'Kevin'}}
        messages={[
          {
            msgId: '1',
            text: 'Hello',
            timestamp: 1627777777777,
            sendId: 'Jade',
            receiveId: 'Kevin',
          },
        ]}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
