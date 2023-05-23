import {axiosClient} from '../axios.config';
function register(username: String, password: String) {
  return axiosClient
    .post('/register', {
      username,
      password, // TODO: encrypt password
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
}

export const authService = {
  register,
};
