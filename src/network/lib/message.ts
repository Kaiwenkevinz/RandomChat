import {ChatComponentProps, CusResponse} from './../../types/network/types';
import {GetAllChatMessageResp} from '../../types/network/types';
import {axiosClient} from '../axios.config';
import {API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES} from '../constant';

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return axiosClient
    .post<CusResponse<GetAllChatMessageResp>>(
      API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
    )
    .then(res => {
      return res;
    });
}

export const ChatService = {
  getAllChatMessages,
};
