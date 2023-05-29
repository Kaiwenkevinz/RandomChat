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
        otherUserName="Jade"
        user={{id: 'usr1', username: 'Kevin'}}
        message={{
          msgId: '1',
          text: 'Hello',
          time: 1627777777777,
          userSend: 'Jade',
          userReceive: 'Kevin',
        }}
      />,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});
