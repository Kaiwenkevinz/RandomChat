import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../axios.config';
import {
  mockAllFriendAllChatMessages,
  mockLogin,
  mockRegister,
  mockSendVerifyEmail,
  mockUserProfile,
} from './mockData';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_GET_USER_INFO,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
  API_UPDATE_USER_INFO,
} from '../constant';

console.log('API mocking is turned on.');

const mock = new MockAdapter(axiosClient, {delayResponse: 1000});

// Register
mock.onPost(API_SEND_EMAIL).reply(200, mockSendVerifyEmail.mockResponse);
mock.onPost(API_REGISTER).reply(200, mockRegister.mockResponse);

// Login
mock.onPost(API_LOGIN).reply(200, mockLogin.mockResponse);

// User profile
mock.onPost(API_GET_USER_INFO).reply(200, mockUserProfile.mockResponse);

// Update user profile
mock.onPost(API_UPDATE_USER_INFO).reply(200);

// 所有好友的所有聊天记录
mock
  .onPost(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
  .reply(200, mockAllFriendAllChatMessages.mockResponse);
