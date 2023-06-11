import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../axios.config';

console.log('API mocking is turned on.');

const mock = new MockAdapter(axiosClient, {delayResponse: 1000});

// Register
mock.onPost('/register').reply(200);
// mock.onPost('/register').reply(-1);

// Login
mock.onPost('/login').reply(200, {
  token: 'jwt112233',
  user: {
    id: 'Kevin',
    username: 'Kevin',
  },
});

export const mockUserProfile = {
  gender: 'male',
  age: 25,
  hometown: 'Mars',
  major: 'Nutural Science',
  contactNumber: '123456789',
  email: '123@email.com',
  birthday: '1996-01-01',
  school: 'Mars University',
  mbti: 'INTJ',
};
mock.onGet('/user/profile').reply(200, mockUserProfile);

mock.onGet('/all_chat_messages').reply(200, {
  rooms: [
    {
      otherUserId: 'Novu Hangouts',
      messages: [
        {
          msgId: '1a',
          text: 'Hello, my name is Novu',
          timestamp: 1685945115831,
          sendId: 'Novu Hangouts',
          receiveId: 'Kevin',
        },
        {
          msgId: '1b',
          text: 'Hi Novu, my name is Kevin! 😇',
          timestamp: 1685945115831,
          sendId: 'Kevin',
          receiveId: 'Novu Hangouts',
        },
        {
          msgId: '1c',
          text: 'Hello, my name is Novu',
          timestamp: 1685945115831,
          sendId: 'Novu Hangouts',
          receiveId: 'Kevin',
        },
        {
          msgId: '1d',
          text: 'Hi Novu, my name is Kevin! 😇',
          timestamp: 1685945115831,
          sendId: 'Kevin',
          receiveId: 'Novu Hangouts',
        },
        {
          msgId: '2c',
          text: 'Hello, my name is Novu',
          timestamp: 1685945115831,
          sendId: 'Novu Hangouts',
          receiveId: 'Kevin',
        },
        {
          msgId: '2d',
          text: 'Hi newest',
          timestamp: 1685945115831,
          sendId: 'Kevin',
          receiveId: 'Novu Hangouts',
        },
      ],
    },
  ],
});
