import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {chatService} from '../../network/lib/message';
import {
  IChatRoom,
  IMessagePackReceive,
  IPagination,
  Result,
} from '../../types/network/types';
import {RootState} from '../store';
import {getChatsAsync} from './thunks/getChatsAsyncThunk';
import {operateReadRoomAsync} from './thunks/operateReadRoomAsyncThunk';

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

const initialState: ChatState = {
  data: [],
  readRooms: [],
  chatStatus: 'idle',
  messageHistoryStatus: 'idle',
};

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

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    reset: state => {
      state.data = [];
      state.chatStatus = 'idle';
    },
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
          total: 10,
          otherUserId: sendId,
          otherUserName: action.payload.sender_name,
          otherUserAvatarUrl: action.payload.sender_avatar_url,
          messages: [action.payload],
        };
        rooms.push(newRoom);
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

        return;
      }

      console.warn(
        'updateMessageStatus: targetRoom should not be null when update message status',
        'otherUserId:',
        otherUserId,
      );
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
        total: 10,
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
export const selectChat = (state: RootState) => state.chat;
// 暴露 action
export const {reset, appendNewMessage, updateMessageStatus, appendNewChatRoom} =
  chatSlice.actions;
// 暴露 reducer
export default chatSlice.reducer;
