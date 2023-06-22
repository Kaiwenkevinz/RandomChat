import {PayloadAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {User} from '../types/network/types';
import {RootState} from './store';
import {userService} from '../network/lib/user';

type UserState = {
  user: User;
  token: string;
  status: 'idle' | 'loading' | 'failed';
};

// state
const initialState: UserState = {
  user: {} as User,
  token: '',
  status: 'idle',
};

export const getProfileAsync = createAsyncThunk<User, void>(
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
    addNewUserInfo: (state, action: PayloadAction<User>) => {
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
      });
  },
});

export const selectUser = (state: RootState) => state.user;
export const {addNewUserInfo, addToken} = userSlice.actions;
export default userSlice.reducer;
