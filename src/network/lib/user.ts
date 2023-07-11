import {API_DELETE_PHOTO_WALL} from './../constant';
import {Result, IUser, IScoreResponse} from '../../types/network/types';
import {api} from '../axios.config';
import {
  API_GET_FRIEND_LIST,
  API_GET_PHOTO_WALL,
  API_GET_RECOMMEND_LIST,
  API_GET_SCORES,
  API_GET_SCORE_THRESHOLD,
  API_GET_USER_INFO,
  API_UPDATE_USER_INFO,
} from '../constant';

function getUserProfile() {
  return api.post<Result<IUser>>(API_GET_USER_INFO);
}

function updateUserProfile(user: IUser) {
  return api.post<Result<IUser>>(API_UPDATE_USER_INFO, user);
}

function getFriendList() {
  return api.post<Result<IUser[]>>(API_GET_FRIEND_LIST);
}

function getRecommendFriendList() {
  return api.post<Result<IUser[]>>(API_GET_RECOMMEND_LIST);
}

function getScoreThreshold() {
  return api.post<Result<number>>(API_GET_SCORE_THRESHOLD);
}

function getScoreOfFriends() {
  return api.post<Result<IScoreResponse[]>>(API_GET_SCORES);
}

function getPhotoWall(userId: number) {
  return api.post<Result<string[]>>(API_GET_PHOTO_WALL, undefined, {
    params: {
      userid: userId,
    },
  });
}
function deletePhotoWall(url: String) {
  return api.post<Result>(API_DELETE_PHOTO_WALL, undefined, {
    params: {
      url,
    },
  });
}

export const userService = {
  getPhotoWall,
  deletePhotoWall,
  getScoreOfFriends,
  getScoreThreshold,
  getUserProfile,
  updateUserProfile,
  getFriendList,
  getRecommendFriendList,
};
