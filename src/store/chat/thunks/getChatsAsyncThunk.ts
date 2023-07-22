import {createAsyncThunk} from '@reduxjs/toolkit';
import {chatService} from '../../../network/lib/message';
import {IChatRoom} from '../../../types/network/types';
import {store} from '../../store';
import {IReadRoom} from '../chatSlice';
import {operateReadRoomAsync} from './operateReadRoomAsyncThunk';

// TODO: maybe use RTK Query for caching?

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
    const readRooms: IReadRoom[] = store.getState().chat.readRooms;
    updateReadRooms(fetchedRooms, readRooms);

    return response.data;
  },
);

export function updateReadRooms(
  fetchedRooms: IChatRoom[],
  readRooms: IReadRoom[],
) {
  // 更新已读聊天室和最新的已读 message id
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
        console.log('remove read room: ', targetRoom.otherUserId);
        store.dispatch(
          operateReadRoomAsync({
            option: 'delete',
            newData: {roomId: targetRoom.otherUserId, msgId: null},
          }),
        );
      }
    }
  });
}
