import {ChatComponentProps, Result} from './../../types/network/types';
import {API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES} from '../constant';
import {api} from '../axios.config';

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return api.post<Result<ChatComponentProps[]>>(
    API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  );
}

export const chatService = {
  getAllChatMessages,
};
