import MockAdapter from 'axios-mock-adapter';
import {axiosClient} from '../../network/axios.config';
import {mockUserProfile} from '../../network/mocks/mockAPI';
import {store} from '../store';
import {getUserProfileAsync} from '../userSlice';

const mockNetworkResponse = () => {
  const mock = new MockAdapter(axiosClient);
  mock.onGet(`/user/profile`).reply(200, mockUserProfile);
};

describe('User slice', () => {
  beforeAll(() => {
    mockNetworkResponse();
  });

  it('should get user profile when get user profile from server', async () => {
    await store.dispatch(getUserProfileAsync());

    const state = store.getState();
    console.log('🚀 ~ file: userSlice.test.ts:21 ~ it ~ state:', state);
    // TODO: fix test
  });
});
