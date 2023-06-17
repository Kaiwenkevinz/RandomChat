import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../../../network/axios.config';
import {API_LOGIN} from '../../../network/constant';
import {mockLogin} from '../../../network/mocks/mockData';
import {authService} from '../../../network/lib/auth';

describe('API 测试', () => {
  // mock 接口返回
  beforeAll(() => {
    const mock = new MockAdapter(axiosClient);
    mock
      .onPost(API_LOGIN, mockLogin.mockRequestBody)
      .reply(200, mockLogin.mockResponse);
  });
  // 第一层级: 标明测试的模块名称
  beforeEach(() => {
    // 每个测试之前都会跑，可以统一添加一些mock等
  });
  afterEach(() => {
    // 每个测试之后都会跑，可以统一添加一些清理功能等
  });
  describe('user service', () => {
    test('should 获得后端数据并返回正确的对象', async () => {
      const resp = await authService.login(
        mockLogin.mockRequestBody.username,
        mockLogin.mockRequestBody.password,
      );

      expect(resp).toEqual(mockLogin.mockResponse);
    });
  });
});
