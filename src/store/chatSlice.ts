import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {IChatRoom, IMessagePackReceive} from '../types/network/types';
import {chatService} from '../network/lib/message';
import {LOCAL_STORAGE_KEY_UNREAD_ROOMS} from '../constant';
import {loadStorageData, saveStorageData} from '../utils/storageUtil';

export interface ChatState {
  data: IChatRoom[];
  unreadRooms: number[];
  status: 'idle' | 'loading' | 'failed';
}

export type SetMessagesStatusToSentType = {
  otherUserId: number;
  msgId: string;
};

export type SetChatRoomHasUnreadMessageType = {
  otherUserId: number;
  hasUnreadMessage: boolean;
};

export type IOperateUnreadRoomsOptions = {
  option: 'read' | 'add' | 'delete';
  newData: number | null;
};

// state
const initialState: ChatState = {
  data: [],
  unreadRooms: [],
  status: 'idle',
};

// async action
// createAsyncThunk 创建一个 异步 action object
// 它对应的 reducer 通过 extraReducers 设置，会自动处理 pending, fulfilled, rejected 状态
export const getChatsAsync = createAsyncThunk<IChatRoom[], void>(
  'chat/fetchAllChatMessages',
  async () => {
    const response = await chatService.getAllChatMessages();
    response.data.forEach((room: IChatRoom) => {
      if (!room.otherUserAvatarUrl || room.otherUserAvatarUrl === '') {
        room.otherUserAvatarUrl =
          'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg';
      }
    });

    return response.data;
  },
);

export const operateUnreadRoomAsync = createAsyncThunk<
  number[],
  IOperateUnreadRoomsOptions
>('chat/operateUnreadRoomsAsync', async ({option, newData}) => {
  let data = await loadStorageData<number[]>(LOCAL_STORAGE_KEY_UNREAD_ROOMS);
  if (!data) {
    data = [];
  }

  if (option === 'read') {
    return data;
  }

  if (option === 'add' && newData) {
    data.push(newData);
  } else if (option === 'delete' && newData) {
    // 删除指定的 unread room
    const index = data.findIndex(id => id === newData);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }
  await saveStorageData(LOCAL_STORAGE_KEY_UNREAD_ROOMS, data);

  return data;
});

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
    // 添加新消息到对应的聊天室
    appendNewMessage: (state, action: PayloadAction<IMessagePackReceive>) => {
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
    // 更新消息发送状态为已发送
    updateMessageStatus: (
      state,
      action: PayloadAction<SetMessagesStatusToSentType>,
    ) => {
      const {otherUserId, msgId} = action.payload;
      const rooms = state.data;
      const targetRoom = rooms.find(room => room.otherUserId === otherUserId);
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
      })
      .addCase(operateUnreadRoomAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(operateUnreadRoomAsync.fulfilled, (state, action) => {
        state.unreadRooms = action.payload;
        state.status = 'idle';
      })
      .addCase(operateUnreadRoomAsync.rejected, (state, _) => {
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
