import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {ChatComponentProps, MessagePack} from '../types/network/types';
import {ChatService} from '../network/lib/message';

export interface ChatState {
  rooms: ChatComponentProps[];
  status: 'idle' | 'loading' | 'failed';
}

// state
const initialState: ChatState = {
  rooms: [],
  status: 'idle',
};

// async action
// createAsyncThunk 创建一个 异步 action object
// 它对应的 reducer 通过 extraReducers 设置，会自动处理 pending, fulfilled, rejected 状态
export const getChatsAsync = createAsyncThunk<ChatComponentProps[], void>(
  'chat/fetchAllChatMessages',
  async () => {
    const response = await ChatService.getAllChatMessages();
    return response.data.rooms;
  },
);

// reducers and actions
// slice 是 reducers 和 action creator 的集合
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    appendNewMessage: (state, action: PayloadAction<MessagePack>) => {
      const {sendId, receiveId} = action.payload;
      const rooms = [...state.rooms];
      const targetRoom = rooms.find(room => {
        if (room.otherUserId === sendId || room.otherUserId === receiveId) {
          return true;
        }
      });

      if (targetRoom) {
        targetRoom.messages.push(action.payload);
      } else {
        console.log('target room not found');
      }

      state = {...state, rooms};
    },
  }, // 这里都是同步 action creator和对应的 reducer
  extraReducers: builder => {
    builder
      .addCase(getChatsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getChatsAsync.fulfilled, (state, action) => {
        // 在 getChatsAsync 完成后，拿到结果并更新 store
        state.status = 'idle';
        state.rooms = action.payload;
      })
      .addCase(getChatsAsync.rejected, (state, _) => {
        state.status = 'failed';
      });
  },
});

// 暴露 state selector
// 使用 useSelector() 获得 state
export const selectRooms = (state: RootState) => state.chat;
// 暴露 action
export const {appendNewMessage} = chatSlice.actions;
// 暴露 reducer
export default chatSlice.reducer;