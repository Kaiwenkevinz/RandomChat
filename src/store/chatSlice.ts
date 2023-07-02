import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {IChatRoom, IMessagePackReceive} from '../types/network/types';
import {chatService} from '../network/lib/message';
import {LOCAL_STORAGE_KEY_READ_ROOMS} from '../constant';
import {loadStorageData, saveStorageData} from '../utils/storageUtil';
import {showToast, toastType} from '../utils/toastUtil';

export interface ChatState {
  data: IChatRoom[];
  readRooms: number[];
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

interface IAppendNewRoomPayload {
  otherUserId: number;
  otherUserName: string;
  otherUserAvatarUrl: string;
}

// state
const initialState: ChatState = {
  data: [],
  readRooms: [],
  status: 'idle',
};

// async action
// createAsyncThunk 创建一个 异步 action object
// 它对应的 reducer 通过 extraReducers 设置，会自动处理 pending, fulfilled, rejected 状态
export const getChatsAsync = createAsyncThunk<IChatRoom[], void>(
  'chat/fetchAllChatMessages',
  async () => {
    const response = await chatService.getAllChatMessages();
    if (!response.data) {
      return [];
    }

    response.data.forEach((room: IChatRoom) => {
      if (!room.otherUserAvatarUrl || room.otherUserAvatarUrl === '') {
        room.otherUserAvatarUrl =
          'https://t3.ftcdn.net/jpg/02/09/37/00/360_F_209370065_JLXhrc5inEmGl52SyvSPeVB23hB6IjrR.jpg';
      }
    });

    return response.data;
  },
);

export const operateReadRoomAsync = createAsyncThunk<
  number[],
  IOperateUnreadRoomsOptions
>('chat/operateReadRoomsAsync', async ({option, newData}) => {
  let data = await loadStorageData<number[]>(LOCAL_STORAGE_KEY_READ_ROOMS);
  if (!data) {
    data = [];
  }

  if (option === 'read') {
    return data;
  }

  if (
    option === 'add' &&
    newData &&
    data.findIndex(id => id === newData) === -1
  ) {
    data.push(newData);
  } else if (option === 'delete' && newData) {
    const index = data.findIndex(id => id === newData);
    if (index !== -1) {
      data.splice(index, 1);
    }
  }
  await saveStorageData(LOCAL_STORAGE_KEY_READ_ROOMS, data);

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
        // 已存在聊天室，直接添加消息
        targetRoom.messages.push(action.payload);
      } else {
        // 新的聊天室，添加聊天室和消息
        const newRoom: IChatRoom = {
          otherUserId: sendId,
          otherUserName: action.payload.sender_name,
          otherUserAvatarUrl: action.payload.sender_avatar_url,
          messages: [action.payload],
        };
        rooms.push(newRoom);
        showToast(toastType.INFO, 'New Friend', 'You have a new friend!');
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
    // 添加新的聊天室
    appendNewChatRoom: (
      state,
      action: PayloadAction<IAppendNewRoomPayload>,
    ) => {
      const {otherUserId, otherUserName, otherUserAvatarUrl} = action.payload;
      const rooms = state.data;

      // 如果已经存在这个聊天室，就不添加了
      const targetRoom = rooms.find(room => room.otherUserId === otherUserId);
      if (targetRoom) {
        return;
      }

      const newRoom: IChatRoom = {
        otherUserId,
        otherUserName,
        otherUserAvatarUrl,
        messages: [],
      };
      rooms.push(newRoom);
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
      .addCase(operateReadRoomAsync.fulfilled, (state, action) => {
        state.readRooms = action.payload;
      });
  },
});

// 暴露 state selector
// 使用 useSelector() 获得 state
export const selectRooms = (state: RootState) => state.chat;
// 暴露 action
export const {reset, appendNewMessage, updateMessageStatus, appendNewChatRoom} =
  chatSlice.actions;
// 暴露 reducer
export default chatSlice.reducer;
