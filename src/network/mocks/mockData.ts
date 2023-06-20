import {LoginResponse, User} from '../../types/network/types';

export const generageMockResponse = <T>(data: T | null = null) => ({
  data,
  msg: 'success',
  status: 'ok',
});

export const mockUser: User = {
  id: 1,
  username: 'Kevin',
  gender: 'male',
  age: 25,
  hometown: 'Mars',
  major: 'Nutural Science',
  telephone_number: '123456789',
  mail: '123@email.com',
  birthday: '1996-01-01',
  school: 'Mars University',
  mbti: 'INTJ',
  avatar_url:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1hjynbpQaeK6JUxCK6WyZ1E5uJmjAxQncw&usqp=CAU',
};

export const mockLogin = {
  mockRequestBody: {
    username: 'Kevin',
    password: '123456',
  },
  mockResponse: generageMockResponse<LoginResponse>({
    user: mockUser,
    token: 'jwt1234567890',
  }),
};

export const mockSendVerifyEmail = {
  mockRequestBody: {
    username: 'Kevin',
    email: '123@email.com',
  },
  mockResponse: generageMockResponse(),
};

export const mockRegister = {
  mockRequestBody: {
    username: 'Kevin',
    password: '123456',
    email: '123@email.com',
    code: 'e-m-a-i-l',
  },
  mockResponse: generageMockResponse<User>(),
};

export const mockAllFriendAllChatMessages = {
  mockRequestBody: {
    id: 1,
  },
  mockResponse: generageMockResponse([
    {
      otherUserId: 200,
      otherUserName: 'Novu Hangouts',
      otherUserAvatarUrl:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
      messages: [
        {
          msgId: '1a',
          text: 'Hello, my name is Novu',
          timestamp: 1685945115831,
          sendId: 200,
          receiveId: 1,
        },
        {
          msgId: '1b',
          text: 'Hi Novu, my name is Kevin! 😇',
          timestamp: 1685945115831,
          sendId: 1,
          receiveId: 200,
        },
        {
          msgId: '1c',
          text: 'Hello, my name is Novu',
          timestamp: 1685945115831,
          sendId: 200,
          receiveId: 1,
        },
        {
          msgId: '1d',
          text: 'Hi Novu, my name is Kevin! 😇',
          timestamp: 1685945115831,
          sendId: 1,
          receiveId: 200,
        },
        {
          msgId: '2c',
          text: 'Hello, my name is Novu',
          timestamp: 1685945115831,
          sendId: 200,
          receiveId: 1,
        },
        {
          msgId: '2d',
          text: 'Hi newest',
          timestamp: 1685945115831,
          sendId: 1,
          receiveId: 200,
        },
      ],
    },
  ]),
};
