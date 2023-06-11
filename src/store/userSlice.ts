import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {UserInfo, UserProfile} from '../types/network/types';
import {RootState} from './store';
import {userService} from '../network/lib/user';

type UserState = {
  userInfo: UserInfo;
  userProfile: Partial<UserProfile>;
  status: 'idle' | 'loading' | 'failed';
};

// state
const initialState: UserState = {
  userInfo: {} as UserInfo,
  userProfile: {},
  status: 'idle',
};

export const getUserProfileAsync = createAsyncThunk<UserProfile, void>(
  'user/getUserProfile',
  async () => {
    const response = await userService.getUserProfile();

    return response.data;
  },
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addNewUserInfo: (state, action: PayloadAction<UserInfo>) => {
      state.userInfo = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getUserProfileAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getUserProfileAsync.fulfilled, (state, action) => {
        state.userProfile = action.payload;
        state.status = 'idle';
      })
      .addCase(getUserProfileAsync.rejected, (state, _) => {
        state.status = 'failed';
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const {addNewUserInfo} = userSlice.actions;
export default userSlice.reducer;
