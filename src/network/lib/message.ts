import {GetRoomsResponse} from '../../types/network/types';
import {axiosClient} from '../axios.config';

/**
 * Fetch chat rooms
 */
function getRooms() {
  return axiosClient.get<GetRoomsResponse>('/allRooms');
}

function getMessages(roomId: string) {
  return axiosClient.get(`/getMessages?roomId=${roomId}`);
}

export const ChatService = {
  getRooms,
  getMessages,
};
