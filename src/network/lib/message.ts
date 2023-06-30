import {CONFIG} from './../../config/index';
import {IChatRoom, ILoginResponse, Result} from './../../types/network/types';
import {
  API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES,
  API_GET_IMAGE,
  API_UPLOAD_AVATAR,
  API_UPLOAD_IMAGE,
} from '../constant';
import {api} from '../axios.config';
import RNFetchBlob from 'rn-fetch-blob';
import {LOCAL_STORAGE_KEY_AUTH} from '../../constant';
import {loadStorageData} from '../../utils/storageUtil';
import {Platform} from 'react-native';

/**
 * Fetch chat rooms
 */
function getAllChatMessages() {
  return api.post<Result<IChatRoom[]>>(API_GET_ALL_FRIENDS_ALL_CHAT_MESSAGES);
}

//TODO: 移出 message.ts
/**
 * 上传图片
 * @param uri 图片本机 uri
 * @param name
 * @param options 聊天图片 | 头像
 * @returns 图片在服务器的 url
 */
const uploadImage = async (
  uri: string,
  name: string,
  options: 'image' | 'avatar',
) => {
  let uploadUrl;
  if (options === 'image') {
    uploadUrl = API_UPLOAD_IMAGE;
  } else {
    uploadUrl = API_UPLOAD_AVATAR;
  }

  const localData = await loadStorageData<ILoginResponse>(
    LOCAL_STORAGE_KEY_AUTH,
  );
  const token = localData?.token;

  const cleanUri = Platform.OS === 'ios' ? uri.replace('file:///', '') : uri;
  console.log('文件本机地址: ', cleanUri);

  const stats = await RNFetchBlob.fs.stat(cleanUri);
  console.log('上传文件大小(mb): ', stats.size / 1024 / 1024);

  const wrapRes = RNFetchBlob.wrap(cleanUri);
  console.log('wrapRes:', wrapRes);

  console.log('上传文件名: ', name);

  try {
    const response = await RNFetchBlob.fetch(
      'POST',
      CONFIG.BASE_API_URL + uploadUrl,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
      [
        {
          name: 'data',
          filename: name,
          data: wrapRes,
        },
      ],
    ).then(res => res.json());

    const url = response.msg;
    console.log('上传图片成功, url: ', url);

    return url;
  } catch (err) {
    console.warn('上传图片失败，原因: ', err);
  }

  return '';
};

//TODO: 移出 message.ts
const getImageUrl = (imageBaseUrl: string | undefined) => {
  return CONFIG.BASE_API_URL + API_GET_IMAGE + '?name=' + imageBaseUrl;
};

export const chatService = {
  getAllChatMessages,
  uploadImage,
  getImageUrl,
};
