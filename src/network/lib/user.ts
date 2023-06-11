import {UserProfile} from '../../types/network/types';
import {axiosClient} from '../axios.config';

function getUserProfile() {
  return axiosClient.get<UserProfile>('/user/profile');
}

export const userService = {
  getUserProfile,
};
