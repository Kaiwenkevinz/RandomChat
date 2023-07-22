import {createAsyncThunk} from '@reduxjs/toolkit';
import {LOCAL_STORAGE_KEY_READ_ROOMS} from '../../../utils/constant';
import {loadStorageData, saveStorageData} from '../../../utils/storageUtil';
import {store} from '../../store';
import {IReadRoom, IOperateReadRoomOptions} from '../chatSlice';

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
