import {LoginResponse} from './../../types/network/types';
import {Response, User} from '../../types/network/types';
import {axiosClient} from '../axios.config';
import {API_LOGIN, API_REGISTER, API_SEND_EMAIL} from '../constant';

function register(
  username: string,
  password: string,
  email: string,
  code: string,
) {
  return axiosClient.post(API_REGISTER, {
    username,
    password, // TODO: encrypt password
    email,
    code,
  });
}

function sendVerifyEmail(username: string, email: string) {
  return axiosClient.post(API_SEND_EMAIL, {
    username,
    email,
  });
}

function login(username: string, password: string) {
  return axiosClient.post<Response<LoginResponse>>(API_LOGIN, {
    username,
    password, // TODO: encrypt password
  });
}

export const authService = {
  register,
  sendVerifyEmail,
  login,
};
