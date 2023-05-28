import {axiosClient} from '../axios.config';
import MockAdapter from 'axios-mock-adapter';

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

// Get the lastest messages of all chat rooms
mock.onGet('/allRooms').reply(200, {
  rooms: [
    {
      roomId: '1',
      otherUser: 'Novu Hangouts',
      messages: [
        {
          msgId: '1a',
          text: 'Hello, my name is Novu',
          time: 1684930783,
          userSend: 'Novu Hangouts',
          userReceive: 'Kevin',
        },
      ],
    },
    {
      roomId: '2',
      otherUser: 'Jade',
      messages: [
        {
          msgId: '2b',
          text: "What's up? I am Kevin 🧑🏻‍💻",
          time: 1684930951,
          userSend: 'Kevin',
          userReceive: 'Jade',
        },
      ],
    },
  ],
});

// Get messages of a room
mock.onGet('/getMessages?roomId=1').reply(200, {
  roomId: '1',
  otherUser: 'Novu Hangouts',
  messages: [
    {
      msgId: '1a',
      text: 'Hello, my name is Novu',
      time: 1684930783,
      userSend: 'Novu Hangouts',
      userReceive: 'Kevin',
    },
    {
      msgId: '1b',
      text: 'Hi Novu, my name is Kevin! 😇',
      time: 1684930951,
      userSend: 'Kevin',
      userReceive: 'Novu Hangouts',
    },
    {
      msgId: '1c',
      text: 'Hello, my name is Novu',
      time: 1684930783,
      userSend: 'Novu Hangouts',
      userReceive: 'Kevin',
    },
    {
      msgId: '1d',
      text: 'Hi Novu, my name is Kevin! 😇',
      time: 1684930951,
      userSend: 'Kevin',
      userReceive: 'Novu Hangouts',
    },
  ],
});
