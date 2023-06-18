import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User} from '../types/network/types';
import {RootState} from './store';
import {userService} from '../network/lib/user';

type UserState = {
  user: User;
  status: 'idle' | 'loading' | 'failed';
};

// state
const initialState: UserState = {
  user: {} as User,
  status: 'idle',
};

export const getProfileAsync = createAsyncThunk<User, void>(
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
    addNewUserInfo: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
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
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const {addNewUserInfo} = userSlice.actions;
export default userSlice.reducer;
