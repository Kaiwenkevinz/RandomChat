import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../axios.config';

console.log('API mocking is turned on.');

const mock = new MockAdapter(axiosClient);

// Register
mock.onPost('/register').reply(200);
// mock.onPost('/register').reply(-1);

// Login
mock.onPost('/login').reply(200, {
  token: 'jwt112233',
  user: {
    id: 'user1',
    username: 'Kevin',
  },
});

mock.onGet('/all_chat_messages').reply(200, {
  rooms: [
    {
      roomId: 'room_1',
      otherUserId: 'Novu Hangouts',
      messages: [
        {
          msgId: '1a',
          text: 'Hello, my name is Novu',
          timestamp: 1684930783,
          sendId: 'Novu Hangouts',
          receiveId: 'Kevin',
        },
        {
          msgId: '1b',
          text: 'Hi Novu, my name is Kevin! 😇',
          timestamp: 1684930951,
          sendId: 'Kevin',
          receiveId: 'Novu Hangouts',
        },
        {
          msgId: '1c',
          text: 'Hello, my name is Novu',
          timestamp: 1684930783,
          sendId: 'Novu Hangouts',
          receiveId: 'Kevin',
        },
        {
          msgId: '1d',
          text: 'Hi Novu, my name is Kevin! 😇',
          timestamp: 1684930951,
          sendId: 'Kevin',
          receiveId: 'Novu Hangouts',
        },
      ],
    },
  ],
});
