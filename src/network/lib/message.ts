import {GetAllChatMessageResp} from '../../types/network/types';
import {axiosClient} from '../axios.config';

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return axiosClient.get<GetAllChatMessageResp>('/all_chat_messages');
}

export const ChatService = {
  getAllChatMessages,
};
