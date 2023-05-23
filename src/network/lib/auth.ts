import {axiosClient} from '../axios.config';
function register(username: String, password: String) {
  return axiosClient.post('/register', {
    username,
    password, // TODO: encrypt password
  });
}

export const authService = {
  register,
};
