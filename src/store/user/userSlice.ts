import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {IScoreMap, IUser} from '../../types/network/types';
import {RootState} from '../store';
import {
  getProfileAsync,
  getScoreMemoAsync,
  getScoreThresholdAsync,
} from './thunks';

export type UserState = {
  user: IUser;
  token: string;
  scoreThreshold: number;
  scoreMemo: IScoreMap;
  status: 'idle' | 'loading' | 'failed';
};

const initialState: UserState = {
  user: {} as IUser,
  token: '',
  scoreThreshold: 10000,
  scoreMemo: {} as IScoreMap,
  status: 'idle',
};

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
