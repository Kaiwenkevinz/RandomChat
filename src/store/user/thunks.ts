import {createAsyncThunk} from '@reduxjs/toolkit';
import {userService} from '../../network/lib/user';
import {IScoreMap, IUser} from '../../types/network/types';

export const getScoreThresholdAsync = createAsyncThunk<number, void>(
  'user/getScoreThreshold',
  async () => {
    let resp = await userService.getScoreThreshold();

    return resp.data;
  },
);

export const getScoreMemoAsync = createAsyncThunk<IScoreMap, void>(
  'user/getScoreMemo',
  async () => {
    const response = await userService.getScoreOfFriends();
    const obj: IScoreMap = {};
    response.data.forEach(item => {
      obj[item.userId] = item.score;
    });

    return obj;
  },
);

export const getProfileAsync = createAsyncThunk<IUser, void>(
  'user/getUserProfile',
  async () => {
    const response = await userService.getUserProfile();
    const user = response.data;
    if (!user.avatar_url || user.avatar_url === '') {
      user.avatar_url =
        'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg';
    }

    return response.data;
  },
);
