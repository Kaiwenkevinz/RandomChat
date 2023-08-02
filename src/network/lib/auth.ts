import {encrypt} from './../../utils/encryptUtil';
import {ILoginResponse} from './../../types/network/types';
import {Result, IUser} from '../../types/network/types';
import {api} from '../axios.config';
import {
  API_FORGET_PASSWORD,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
} from '../constant';
import {generateMockResponse} from '../mocks/mockData';

// TODO: secure this
const AES_KEY = '1234123412ABCDEF';

function register(
  username: string,
  password: string,
  email: string,
  code: string,
) {
  return api.post<Result<IUser>>(API_REGISTER, {
    code,
    user: {
      username,
      password: encrypt(password, AES_KEY),
      mail: email,
    },
  });
}

function sendVerifyEmail(username: string, email: string) {
  return api.post<Result>(API_SEND_EMAIL, {
    username,
    mail: email,
  });
}

function login(username: string, password: string) {
  return api.post<Result<ILoginResponse>>(API_LOGIN, {
    username,
    password: encrypt(password, AES_KEY),
  });
}

function forgetPassword(username: string, email: string) {
  return api.post<Result>(
    API_FORGET_PASSWORD,
    {},
    {
      params: {
        username,
        mail: email,
      },
    },
  );
}

function fetchSecretKey() {
  return new Promise(resolve => {
    resolve(generateMockResponse('SECRET_KEY'));
  });
  // TODO: waiting for backend
  // return api.post<Result<string>>(API_GET_SECRET_KEY);
}

export const authService = {
  fetchSecretKey,
  register,
  sendVerifyEmail,
  login,
  forgetPassword,
};
