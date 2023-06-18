import {ChatComponentProps, Result} from './../../types/network/types';
import {GetAllChatMessageResp} from '../../types/network/types';
import {axiosClient} from '../axios.config';
import {API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES} from '../constant';
import {prettyPrint} from '../../utils/printUtil';
import {AxiosResponse} from 'axios';

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return axiosClient
    .post<Result<GetAllChatMessageResp>>(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES)
    .then(res => {
      return res;
    });
}

export const ChatService = {
  getAllChatMessages,
};
