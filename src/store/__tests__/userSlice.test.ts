import {generageMockResponse} from './../../network/mocks/mockData';
import {API_GET_USER_INFO} from './../../network/constant';
import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../../network/axios.config';
import {mockUserProfile} from '../../network/mocks/mockAPI';
import {store} from '../store';
import {getProfileAsync} from '../userSlice';

const mockNetworkResponse = () => {
  const mock = new MockAdapter(axiosClient);
  mock
    .onGet(API_GET_USER_INFO)
    .reply(200, generageMockResponse(mockUserProfile));
};

describe('User slice', () => {
  beforeAll(() => {
    mockNetworkResponse();
  });

  it('should get user profile when get user profile from server', async () => {
    await store.dispatch(getProfileAsync());

    const state = store.getState();
    console.log('🚀 ~ file: userSlice.test.ts:21 ~ it ~ state:', state);
  });
});
