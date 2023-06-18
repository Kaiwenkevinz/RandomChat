import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../axios.config';
import {
  mockAllFriendAllChatMessages,
  mockLogin,
  mockRegister,
  mockSendVerifyEmail,
} from './mockData';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
} from '../constant';

console.log('API mocking is turned on.');

const mock = new MockAdapter(axiosClient, {delayResponse: 1000});

// Register
mock.onPost(API_SEND_EMAIL).reply(200, mockSendVerifyEmail.mockResponse);
mock.onPost(API_REGISTER).reply(200, mockRegister.mockResponse);

// Login
mock.onPost(API_LOGIN).reply(200, mockLogin.mockResponse);

export const mockUserProfile = {
  gender: 'male',
  age: 25,
  hometown: 'Mars',
  major: 'Nutural Science',
  telephone_number: '123456789',
  email: '123@email.com',
  birthday: '1996-01-01',
  school: 'Mars University',
  mbti: 'INTJ',
  avatarUrl:
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG1hjynbpQaeK6JUxCK6WyZ1E5uJmjAxQncw&usqp=CAU',
};
mock.onGet('/user/profile').reply(200, mockUserProfile);

mock.onPost('/user/update/profile').reply(200);

mock
  .onGet(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
  .reply(200, mockAllFriendAllChatMessages.mockResponse);
