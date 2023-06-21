import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {ChatComponentProps, MessagePackReceive} from '../types/network/types';
import {chatService} from '../network/lib/message';

export interface ChatState {
  data: ChatComponentProps[];
  status: 'idle' | 'loading' | 'failed';
}

export type SetMessagesStatusToSentType = {
  otherUserId: number;
  msgId: string;
};

// state
const initialState: ChatState = {
  data: [],
  status: 'idle',
};

// async action
// createAsyncThunk 创建一个 异步 action object
// 它对应的 reducer 通过 extraReducers 设置，会自动处理 pending, fulfilled, rejected 状态
export const getChatsAsync = createAsyncThunk<ChatComponentProps[], void>(
  'chat/fetchAllChatMessages',
  async () => {
    const response = await chatService.getAllChatMessages();
    return response.data;
  },
);

// reducers and actions
// slice 是 reducers 和 action creator 的集合
export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    reset: state => {
      state.data = [];
      state.status = 'idle';
    },
    appendNewMessage: (state, action: PayloadAction<MessagePackReceive>) => {
      const {sender_id: sendId, receiver_id: receiveId} = action.payload;
      const rooms = state.data;
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
    },
    updateMessageStatus: (
      state,
      action: PayloadAction<SetMessagesStatusToSentType>,
    ) => {
      const {otherUserId, msgId} = action.payload;
      const rooms = state.data;
      const targetRoom = rooms.find(room => {
        if (room.otherUserId === otherUserId) {
          return true;
        }
      });
      if (targetRoom) {
        const targetMessage = targetRoom.messages.find(message => {
          if (message.id === msgId) {
            return true;
          }
        });
        if (targetMessage) {
          delete targetMessage.isSent;
        }
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(getChatsAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(getChatsAsync.fulfilled, (state, action) => {
        // 在 getChatsAsync 完成后，拿到结果并更新 store
        state.status = 'idle';
        state.data = action.payload;
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
export const {reset, appendNewMessage, updateMessageStatus} = chatSlice.actions;
// 暴露 reducer
export default chatSlice.reducer;
