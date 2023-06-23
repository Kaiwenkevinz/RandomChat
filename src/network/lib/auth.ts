import {ILoginResponse} from './../../types/network/types';
import {Result, IUser} from '../../types/network/types';
import {api} from '../axios.config';
import {API_LOGIN, API_REGISTER, API_SEND_EMAIL} from '../constant';

function register(
  username: string,
  password: string,
  email: string,
  code: string,
) {
  return api.post<Result<IUser>>(API_REGISTER, {
    username,
    password, // TODO: encrypt password
    email,
    code,
  });
}

function sendVerifyEmail(username: string, email: string) {
  return api.post<Result>(API_SEND_EMAIL, {
    username,
    email,
  });
}

function login(username: string, password: string) {
  return api.post<Result<ILoginResponse>>(API_LOGIN, {
    username,
    password, // TODO: encrypt password
  });
}

export const authService = {
  register,
  sendVerifyEmail,
  login,
};
