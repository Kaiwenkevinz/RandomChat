import {
  IChatRoom,
  Result,
  IPagination,
  IMessagePackReceive,
} from './../../types/network/types';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_GET_CHAT_GPT,
  API_GET_MESSAGE_HISTORY,
} from '../constant';
import {api} from '../axios.config';

/**
 * 分页获取聊天历史
 */
function getMessageHistory(
  otherUserId: number,
  page: number,
  pageSize: number,
) {
  return api.post<Result<IPagination<IMessagePackReceive[]>>>(
    API_GET_MESSAGE_HISTORY,
    {
      otherUserId,
      page,
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
  return api.post<Result<string>>(API_GET_CHAT_GPT, {type, content});
}

export const chatService = {
  getAllChatMessages,
  getMessageHistory,
  getChatGPT,
};
