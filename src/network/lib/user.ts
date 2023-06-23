import {Result, IUser} from '../../types/network/types';
import {api} from '../axios.config';
import {API_GET_USER_INFO, API_UPDATE_USER_INFO} from '../constant';

function getUserProfile() {
  return api.post<Result<IUser>>(API_GET_USER_INFO);
}

function updateUserProfile(user: IUser) {
  return api.post<Result<IUser>>(API_UPDATE_USER_INFO, user);
}

export const userService = {
  getUserProfile,
  updateUserProfile,
};
