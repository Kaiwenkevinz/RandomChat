import {
  IChatRoom,
  Result,
  IPagination,
  IMessagePackReceive,
} from './../../types/network/types';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_GET_CHAT_GPT,
  API_GET_MESSAGE_BY_PAGE,
} from '../constant';
import {api} from '../axios.config';

/**
 * 分页获取聊天历史
 */
function getMessageByPage(otherUserId: number, page: number, pageSize: number) {
  return api.post<Result<IPagination<IMessagePackReceive[]>>>(
    API_GET_MESSAGE_BY_PAGE,
    {
      friendId: otherUserId,
      offset: page,
      pageSize,
    },
  );
}

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return api.post<Result<IChatRoom[]>>(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES);
}

function getChatGPT(type: string, content: string) {
  return api.post<Result<string>>(API_GET_CHAT_GPT, {type, body: content});
}

export const chatService = {
  getAllChatMessages,
  getMessageByPage,
  getChatGPT,
};
