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
  avatarUrl:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1hjynbpQaeK6JUxCK6WyZ1E5uJmjAxQncw&usqp=CAU',
};
mock.onGet('/user/profile').reply(200, mockUserProfile);

mock.onGet('/all_chat_messages').reply(200, {
  rooms: [
    {
      otherUserId: 'Novu Hangouts',
      otherUserAvatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
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
    {
      otherUserId: 'Novu Hangouts 2',
      otherUserAvatarUrl:
        'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?w=2000',
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
      ],
    },
  ],
});

mock.onPost('/user/update/profile').reply(200);
