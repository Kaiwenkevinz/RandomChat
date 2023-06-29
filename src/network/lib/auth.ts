import {ILoginResponse} from './../../types/network/types';
import {Result, IUser} from '../../types/network/types';
import {api} from '../axios.config';
import {
  API_FORGET_PASSWORD,
  API_LOGIN,
  API_REGISTER,
  API_SEND_EMAIL,
} from '../constant';

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
      password, // TODO: encrypt password
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
    password, // TODO: encrypt password
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

export const authService = {
  register,
  sendVerifyEmail,
  login,
  forgetPassword,
};
