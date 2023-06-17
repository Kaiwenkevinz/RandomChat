import { LoginResponse } from './../../types/network/types';
import {Response, User} from '../../types/network/types';
import {axiosClient} from '../axios.config';
import {API_LOGIN} from '../constant';

function register(username: String, password: String) {
  return axiosClient.post('/register', {
    username,
    password, // TODO: encrypt password
  });
}

// function login(username: String, password: String) {
//   return axiosClient.post<LoginResponse>('/login', {
//     username,
//     password, // TODO: encrypt password
//   });
// }

function login(username: String, password: String) {
  return axiosClient.post<Response<LoginResponse>>(API_LOGIN, {
    username,
    password, // TODO: encrypt password
  });
}

export const authService = {
  register,
  login,
};
