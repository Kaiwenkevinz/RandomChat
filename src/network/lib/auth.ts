import {LoginResponse} from '../../types/network/types';
import {axiosClient} from '../axios.config';

function register(username: String, password: String) {
  return axiosClient.post('/register', {
    username,
    password, // TODO: encrypt password
  });
}

function login(username: String, password: String) {
  return axiosClient.post<LoginResponse>('/login', {
    username,
    password, // TODO: encrypt password
  });
}

export const authService = {
  register,
  login,
};
