import {axiosClient} from '../axios.config';

export function getUser() {
  return axiosClient.get('/users');
}
