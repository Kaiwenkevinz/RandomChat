import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../../../network/axios.config';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
} from '../../../network/constant';
import {
  mockAllFriendAllChatMessages,
  mockLogin,
  mockRegister,
  mockSendVerifyEmail,
} from '../../../network/mocks/mockData';
import {authService} from '../../../network/lib/auth';
import {ChatService} from '../../../network/lib/message';

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

  describe('user service', () => {
    test('登录接口 should 获得后端数据并返回正确的对象', async () => {
      mock
        .onPost(API_LOGIN, mockLogin.mockRequestBody)
        .reply(200, mockLogin.mockResponse);

      const resp = await authService.login(
        mockLogin.mockRequestBody.username,
        mockLogin.mockRequestBody.password,
      );

      expect(resp).toEqual(mockLogin.mockResponse);
    });

    test('登录用户不存在 should 返回相应的自定义错误信息', async () => {
      mock
        .onPost(API_LOGIN, mockLogin.mockRequestBody)
        .reply(200, {status: 'error', msg: 'No such user!', data: null});

      await authService
        .login(
          mockLogin.mockRequestBody.username,
          mockLogin.mockRequestBody.password,
        )
        .catch(error => expect(error.message).toEqual('No such user!'));
    });

    test('发送邮件地址接口 should 获得后端返回的发送成功消息', async () => {
      mock
        .onPost(API_SEND_EMAIL, mockSendVerifyEmail.mockRequestBody)
        .reply(200, mockSendVerifyEmail.mockResponse);

      const resp = await authService.sendVerifyEmail(
        mockSendVerifyEmail.mockRequestBody.username,
        mockSendVerifyEmail.mockRequestBody.email,
      );

      expect(resp).toEqual(mockSendVerifyEmail.mockResponse);
    });

    test('注册接口 should 返回登录成功的用户信息', async () => {
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
  });

  describe('chat service', () => {
    test('获取与所有好友的所有聊天记录', async () => {
      mock
        .onPost(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
        .reply(200, mockAllFriendAllChatMessages.mockResponse);
      const resp = await ChatService.getAllChatMessages();

      expect(resp).toEqual(mockAllFriendAllChatMessages.mockResponse);
    });
  });
});
