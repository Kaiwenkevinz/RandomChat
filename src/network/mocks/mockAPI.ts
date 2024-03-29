import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../axios.config';
import {
  generateMockResponse,
  mockAllFriendAllChatMessages,
  mockFriendList,
  mockLogin,
  mockMessageHistory,
  mockPhotoWall,
  mockRegister,
  mockScores,
  mockSendVerifyEmail,
  mockUploadImageRepsonse,
  mockUserProfile,
} from './mockData';
import {
  API_FORGET_PASSWORD,
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_GET_CHAT_GPT,
  API_GET_FRIEND_LIST,
  API_GET_MESSAGE_BY_PAGE,
  API_GET_PHOTO_WALL,
  API_GET_RECOMMEND_LIST,
  API_GET_SCORES,
  API_GET_SCORE_THRESHOLD,
  API_GET_SECRET_KEY,
  API_GET_USER_INFO,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
  API_UPDATE_USER_INFO,
  API_UPLOAD_IMAGE,
} from '../constant';

console.warn('API mocking is turned on.');

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
    return [200, generateMockResponse()];
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
  // 好友列表
  if (config.method === 'post' && config.url === API_GET_FRIEND_LIST) {
    return [200, mockFriendList.mockResponse];
  }
  // 推荐好友列表
  if (config.method === 'post' && config.url === API_GET_RECOMMEND_LIST) {
    return [200, mockFriendList.mockResponse];
  }
  // 忘记密码
  if (config.method === 'post' && config.url === API_FORGET_PASSWORD) {
    return [200, generateMockResponse()];
  }
  // 亲密度阈值
  if (config.method === 'post' && config.url === API_GET_SCORE_THRESHOLD) {
    return [200, generateMockResponse(10010)];
  }
  // 所有好友亲密度
  if (config.method === 'post' && config.url === API_GET_SCORES) {
    return [200, mockScores.mockResponse];
  }
  // 分页获取聊天历史信息
  if (config.method === 'post' && config.url === API_GET_MESSAGE_BY_PAGE) {
    return [200, mockMessageHistory.mockResponse];
  }
  // 获取照片墙
  if (config.method === 'post' && config.url === API_GET_PHOTO_WALL) {
    return [200, mockPhotoWall.mockResponse];
  }
  // secret key
  if (config.method === 'post' && config.url === API_GET_SECRET_KEY) {
    return [200, generateMockResponse('secret-key')];
  }
  // Chat GPT
  if (config.method === 'post' && config.url === API_GET_CHAT_GPT) {
    return [
      200,
      generateMockResponse("I'm doing well, thank you. How about yourself?"),
    ];
  }

  return [404];
});
