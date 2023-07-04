import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {IScoreMap, IUser} from '../types/network/types';
import {RootState} from './store';
import {userService} from '../network/lib/user';
import {LOCAL_STORAGE_KEY_SCORE_THRESHOLD} from '../constant';
import {loadStorageData} from '../utils/storageUtil';

type UserState = {
  user: IUser;
  token: string;
  scoreThreshold: number;
  scoreMemo: IScoreMap;
  status: 'idle' | 'loading' | 'failed';
};

// state
const initialState: UserState = {
  user: {} as IUser,
  token: '',
  scoreThreshold: 10000,
  scoreMemo: {} as IScoreMap,
  status: 'idle',
};

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
    if (!response.data.avatar_url || response.data.avatar_url === '') {
      response.data.avatar_url =
        'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg';
    }

    return response.data;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addNewUserInfo: (state, action: PayloadAction<IUser>) => {
      state.user = action.payload;
    },
    addToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getProfileAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = 'idle';
      })
      .addCase(getProfileAsync.rejected, (state, _) => {
        state.status = 'failed';
      })
      .addCase(getScoreMemoAsync.fulfilled, (state, action) => {
        state.scoreMemo = action.payload;
      })
      .addCase(getScoreThresholdAsync.fulfilled, (state, action) => {
        state.scoreThreshold = action.payload;
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const {addNewUserInfo, addToken} = userSlice.actions;
export default userSlice.reducer;
