import {UserProfile} from '../../types/network/types';
import {axiosClient} from '../axios.config';

function getUserProfile() {
  return axiosClient.get<UserProfile>('/user/profile');
}

function updateUserProfile(userProfile: UserProfile) {
  return axiosClient.post<UserProfile>('/user/update/profile', userProfile);
}

export const userService = {
  getUserProfile,
  updateUserProfile,
};
