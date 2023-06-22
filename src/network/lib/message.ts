import {prettyPrint} from './../../utils/printUtil';
import {ChatComponentProps, Result} from './../../types/network/types';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_UPLOAD_IMAGE,
} from '../constant';
import {api} from '../axios.config';

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return api.post<Result<ChatComponentProps[]>>(
    API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  );
}

const uploadImage = async (uri: string, name: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();

  const formData = new FormData();
  formData.append('photo', {
    type: 'image/jpeg',
    name,
    file: blob,
  });

  return api.post<Result<string>>(API_UPLOAD_IMAGE, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const chatService = {
  getAllChatMessages,
  uploadImage,
};
