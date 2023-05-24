import {axiosClient} from '../axios.config';
import MockAdapter from 'axios-mock-adapter';

console.log('API mocking is turned on.');

const mock = new MockAdapter(axiosClient);

mock.onGet('/users').reply(200, {
  users: [
    {
      name: 'banadaaaa',
      description: 'ffffffake user from axios-config-mock-adapter',
    },
  ],
});

// Register
mock.onPost('/register').reply(200);
// mock.onPost('/register').reply(-1);

// Login
mock.onPost('/login').reply(200);
