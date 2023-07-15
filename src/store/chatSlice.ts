import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {LOCAL_STORAGE_KEY_READ_ROOMS} from '../utils/constant';
import {chatService} from '../network/lib/message';
import {
  IChatRoom,
  IMessagePackReceive,
  IPagination,
  Result,
} from '../types/network/types';
import {loadStorageData, saveStorageData} from '../utils/storageUtil';
import {showToast, toastType} from '../utils/toastUtil';
import {RootState, store} from './store';

export interface IReadRoom {
  roomId: number;
  msgId: string | null;
}

export interface ChatState {
  data: IChatRoom[];
  readRooms: IReadRoom[];
  chatStatus: 'idle' | 'loading' | 'failed';
  messageHistoryStatus: 'idle' | 'loading' | 'failed';
}

export type SetMessagesStatusToSentType = {
  otherUserId: number;
  msgId: string;
};

export type SetChatRoomHasUnreadMessageType = {
  otherUserId: number;
  hasUnreadMessage: boolean;
};

export type IOperateReadRoomOptions = {
  option: 'read' | 'add' | 'delete';
  newData: IReadRoom | null;
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
  chatStatus: 'idle',
  messageHistoryStatus: 'idle',
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

    // 更新已读聊天室
    const fetchedRooms = response.data;
    const readRooms = await loadStorageData<IReadRoom[]>(
      LOCAL_STORAGE_KEY_READ_ROOMS,
    );
    readRooms?.forEach(readRoom => {
      const targetRoom = fetchedRooms.find(
        room => room.otherUserId === readRoom.roomId,
      );
      // 已读聊天室的消息不是最新的, 则移除已读聊天室
      if (targetRoom && targetRoom.messages.length > 0) {
        if (
          readRoom.msgId !==
          targetRoom.messages[targetRoom.messages.length - 1].id
        ) {
          store.dispatch(
            operateReadRoomAsync({
              option: 'delete',
              newData: {roomId: targetRoom.otherUserId, msgId: null},
            }),
          );
        }
      }
    });

    return response.data;
  },
);

export const operateReadRoomAsync = createAsyncThunk<
  IReadRoom[],
  IOperateReadRoomOptions
>('chat/operateReadRoomsAsync', async ({option, newData}) => {
  const readRooms = [...store.getState().chat.readRooms];
  const allRooms = store.getState().chat.data;

  switch (option) {
    case 'read':
      let localStorageReadRooms = await loadStorageData<IReadRoom[]>(
        LOCAL_STORAGE_KEY_READ_ROOMS,
      );
      return localStorageReadRooms || [];
    case 'add':
      if (!newData) {
        console.warn('operateReadRoomAsync: newData should not be null');

        return readRooms;
      }
      // 如果不存在 newData.msgId，则找对应 room 的最新 msgId
      let msgId = '';
      if (!newData.msgId) {
        const targetRoom = allRooms.find(
          room => room.otherUserId === newData.roomId,
        );

        if (!targetRoom) {
          console.warn(
            'operateReadRoomAsync: targetRoom should not be null when newData.msgId is null',
          );

          return readRooms;
        }

        if (targetRoom.messages.length > 0) {
          msgId = targetRoom.messages[targetRoom.messages.length - 1].id;
          newData.msgId = msgId;
        }
      }

      // 如果 room 在 readRooms，说明本身已读，则更新 msgId
      // 如果不存在 room，则添加到 readRooms
      const targetReadRoom = readRooms.find(
        room => room.roomId === newData.roomId,
      );
      if (targetReadRoom) {
        targetReadRoom.msgId = newData.msgId;
      } else {
        readRooms.push(newData);
      }

      break;
    case 'delete':
      if (!newData) {
        console.warn('operateReadRoomAsync: newData should not be null');

        return readRooms;
      }

      const deleteIndex = readRooms.findIndex(
        room => room.roomId === newData.roomId,
      );
      if (deleteIndex !== -1) {
        readRooms.splice(deleteIndex, 1);
      }

      break;
    default:
      break;
  }

  // 异步存储，不用等待完成
  saveStorageData(LOCAL_STORAGE_KEY_READ_ROOMS, readRooms);
  return readRooms;
});

/**
 * 聊天记录分页获取
 */
interface IGetMessageHistoryReturn {
  result: Result<IPagination<IMessagePackReceive[]>>;
  otherUserId: number;
}
export interface IGetMessageHistoryParams {
  otherUserId: number;
  page: number;
  pageSize: number;
}
export const getMessageHistoryAsync = createAsyncThunk<
  IGetMessageHistoryReturn,
  IGetMessageHistoryParams
>(
  'chat/getMessageHistoryAsync',
  async ({otherUserId, page, pageSize}: IGetMessageHistoryParams) => {
    const response = await chatService.getMessageHistory(
      otherUserId,
      page,
      pageSize,
    );

    return {result: response, otherUserId} as IGetMessageHistoryReturn;
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
      state.chatStatus = 'idle';
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
      // 所有聊天室的最新一部分聊天记录
      .addCase(getChatsAsync.pending, state => {
        state.chatStatus = 'loading';
      })
      .addCase(getChatsAsync.fulfilled, (state, action) => {
        state.chatStatus = 'idle';
        state.data = action.payload;
      })
      .addCase(getChatsAsync.rejected, (state, _) => {
        state.chatStatus = 'failed';
      })

      // 已读聊天室
      .addCase(operateReadRoomAsync.fulfilled, (state, action) => {
        state.readRooms = action.payload;
      })

      // 聊天记录分页查询
      .addCase(getMessageHistoryAsync.pending, state => {
        state.messageHistoryStatus = 'loading';
      })
      .addCase(getMessageHistoryAsync.fulfilled, (state, action) => {
        // 聊天记录
        const data = action.payload.result.data.data;
        const otherUserId = action.payload.otherUserId;

        if (data.length === 0) {
          return;
        }

        const targetRoom = state.data.find(
          room => room.otherUserId === otherUserId,
        );
        if (targetRoom) {
          targetRoom.messages = [...data, ...targetRoom.messages];
        }

        state.messageHistoryStatus = 'idle';
      })
      .addCase(getMessageHistoryAsync.rejected, (state, _) => {
        state.messageHistoryStatus = 'failed';
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
