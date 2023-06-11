import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {UserInfo} from '../types/network/types';
import {RootState} from './store';

// state
const initialState: UserInfo = {
  id: '',
  username: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addNewUserInfo: (state, action: PayloadAction<UserInfo>) => {
      const {id, username} = action.payload;
      state.id = id;
      state.username = username;
    },
  },
});

export const selectUser = (state: RootState) => state.user;
export const {addNewUserInfo} = userSlice.actions;
export default userSlice.reducer;
