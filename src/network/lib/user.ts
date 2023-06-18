import {User} from '../../types/network/types';
import {axiosClient} from '../axios.config';

function getUserProfile() {
  return axiosClient.get<User>('/user/profile');
}

function updateUserProfile(user: User) {
  return axiosClient.post<User>('/user/update/profile', user);
}

export const userService = {
  getUserProfile,
  updateUserProfile,
};
