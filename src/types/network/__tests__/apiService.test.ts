import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../../../network/axios.config';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
  API_ERROR_MSG,
  API_GET_FRIEND_LIST,
  API_GET_USER_INFO,
  API_UPDATE_USER_INFO,
} from '../../../network/constant';
import {
  generageMockResponse,
  mockAllFriendAllChatMessages,
  mockLogin,
  mockRegister,
  mockSendVerifyEmail,
  mockUserProfile,
} from '../../../network/mocks/mockData';
import {authService} from '../../../network/lib/auth';
import {chatService} from '../../../network/lib/message';
import {userService} from '../../../network/lib/user';
import {User} from '../types';

describe('API 测试', () => {
  let mock: MockAdapter;
  // mock 接口返回
  beforeAll(() => {});
  // 第一层级: 标明测试的模块名称
  beforeEach(() => {
    // 每个测试之前都会跑，可以统一添加一些mock等
    mock = new MockAdapter(axiosClient);
  });
  afterEach(() => {
    // 每个测试之后都会跑，可以统一添加一些清理功能等
    mock.reset();
  });

  describe('Auth service 登录注册相关接口', () => {
    test(`登录成功 should 获得相关 token 和用户信息 (${API_LOGIN})`, async () => {
      mock
        .onPost(API_LOGIN, mockLogin.mockRequestBody)
        .reply(200, mockLogin.mockResponse);

      const resp = await authService.login(
        mockLogin.mockRequestBody.username,
        mockLogin.mockRequestBody.password,
      );

      expect(resp).toEqual(mockLogin.mockResponse);
    });

    test(`用户不存在 should 返回相应的自定义错误信息 (${API_LOGIN})`, async () => {
      mock.onPost(API_LOGIN, mockLogin.mockRequestBody).reply(200, {
        status: 'error',
        msg: API_ERROR_MSG.NO_SUCH_USER,
        data: null,
      });

      await authService
        .login(
          mockLogin.mockRequestBody.username,
          mockLogin.mockRequestBody.password,
        )
        .catch(error =>
          expect(error.message).toEqual(API_ERROR_MSG.NO_SUCH_USER),
        );
    });

    test(`发送邮件地址接口 should 获得后端返回的发送成功消息 (${API_SEND_EMAIL})`, async () => {
      mock
        .onPost(API_SEND_EMAIL, mockSendVerifyEmail.mockRequestBody)
        .reply(200, mockSendVerifyEmail.mockResponse);

      const resp = await authService.sendVerifyEmail(
        mockSendVerifyEmail.mockRequestBody.username,
        mockSendVerifyEmail.mockRequestBody.email,
      );

      expect(resp).toEqual(mockSendVerifyEmail.mockResponse);
    });

    test(`注册成功 should 返回用户信息 (${API_REGISTER})`, async () => {
      mock
        .onPost(API_REGISTER, mockRegister.mockRequestBody)
        .reply(200, mockRegister.mockResponse);
      const resp = await authService.register(
        mockRegister.mockRequestBody.username,
        mockRegister.mockRequestBody.password,
        mockRegister.mockRequestBody.email,
        mockRegister.mockRequestBody.code,
      );

      expect(resp).toEqual(mockRegister.mockResponse);
    });

    test(`注册失败 should 返回自定义的错误信息 (${API_REGISTER})`, async () => {
      mock.onPost(API_REGISTER, mockRegister.mockRequestBody).reply(200, {
        status: 'error',
        msg: API_ERROR_MSG.USERNAME_ALREADY_EXIST,
        data: null,
      });
      await authService
        .register(
          mockRegister.mockRequestBody.username,
          mockRegister.mockRequestBody.password,
          mockRegister.mockRequestBody.email,
          mockRegister.mockRequestBody.code,
        )
        .catch(error =>
          expect(error.message).toEqual(API_ERROR_MSG.USERNAME_ALREADY_EXIST),
        );
    });
  });

  describe('Chat service 聊天相关接口', () => {
    test(`should 获取与所有好友的所有聊天记录 (${API_GET_FRIEND_LIST})`, async () => {
      mock
        .onPost(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
        .reply(200, mockAllFriendAllChatMessages.mockResponse);
      const resp = await chatService.getAllChatMessages();

      expect(resp).toEqual(mockAllFriendAllChatMessages.mockResponse);
    });
  });

  describe('User service 用户相关接口', () => {
    test(`should 获取用户资料 (${API_GET_USER_INFO})`, async () => {
      mock.onPost(API_GET_USER_INFO).reply(200, mockUserProfile.mockResponse);
      const resp = await userService.getUserProfile();

      expect(resp).toEqual(mockUserProfile.mockResponse);
    });

    test(`should 更新用户资料 (${API_UPDATE_USER_INFO})`, async () => {
      const newUser = {
        ...mockUserProfile.mockResponse.data,
        username: 'newUsername',
      } as User;
      mock
        .onPost(API_UPDATE_USER_INFO, newUser)
        .reply(200, generageMockResponse());
      const resp = await userService.updateUserProfile(newUser);

      expect(resp).toEqual(generageMockResponse());
    });
  });
});
