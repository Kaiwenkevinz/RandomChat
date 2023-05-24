import {axiosClient} from '../axios.config';

function register(username: String, password: String) {
  return axiosClient.post('/register', {
    username,
    password, // TODO: encrypt password
  });
}

function login(username: String, password: String) {
  return axiosClient.post('/login', {
    username,
    password, // TODO: encrypt password
  });
}

export const authService = {
  register,
  login,
};
