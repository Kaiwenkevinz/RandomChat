import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../axios.config';
import {
  generageMockResponse,
  mockAllFriendAllChatMessages,
  mockLogin,
  mockRegister,
  mockSendVerifyEmail,
  mockUploadImageRepsonse,
  mockUserProfile,
} from './mockData';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_GET_USER_INFO,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
  API_UPDATE_USER_INFO,
  API_UPLOAD_IMAGE,
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

mock.onAny().reply(config => {
  // Update user profile
  if (config.method === 'post' && config.url === API_UPDATE_USER_INFO) {
    return [200, generageMockResponse()];
  }
  // 所有好友的所有聊天记录
  if (
    config.method === 'post' &&
    config.url === API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES
  ) {
    return [200, mockAllFriendAllChatMessages.mockResponse];
  }
  // 上传图片
  if (config.method === 'post' && config.url === API_UPLOAD_IMAGE) {
    return [200, mockUploadImageRepsonse];
  }

  return [404];
});
