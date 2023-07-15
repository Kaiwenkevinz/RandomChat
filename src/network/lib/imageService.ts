import {CONFIG} from '../../config/index';
import {ILoginResponse} from '../../types/network/types';
import {
  API_GET_IMAGE,
  API_UPLOAD_AVATAR,
  API_UPLOAD_IMAGE,
  API_UPLOAD_PHOTO_WALL,
} from '../constant';
import RNFetchBlob from 'rn-fetch-blob';
import {LOCAL_STORAGE_KEY_AUTH} from '../../utils/constant';
import {loadStorageData} from '../../utils/storageUtil';
import {Platform} from 'react-native';

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
  options: 'image' | 'avatar' | 'photoWall',
) => {
  let uploadUrl;
  if (options === 'image') {
    uploadUrl = API_UPLOAD_IMAGE;
  } else if (options === 'avatar') {
    uploadUrl = API_UPLOAD_AVATAR;
  } else {
    uploadUrl = API_UPLOAD_PHOTO_WALL;
  }

  const localData = await loadStorageData<ILoginResponse>(
    LOCAL_STORAGE_KEY_AUTH,
  );
  const token = localData?.token;

  const cleanUri = Platform.OS === 'ios' ? uri.replace('file:///', '') : uri;
  const stats = await RNFetchBlob.fs.stat(cleanUri);
  const wrapRes = RNFetchBlob.wrap(cleanUri);

  console.log('准备上传图片', {
    'file size': stats.size / 1024 / 1024,
    wrapRes,
    filename: name,
    'upload api url': CONFIG.BASE_API_URL + uploadUrl,
  });

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

const getImageUrl = (imageBaseUrl: string | undefined) => {
  return CONFIG.BASE_API_URL + API_GET_IMAGE + '?name=' + imageBaseUrl;
};

export const imageService = {
  uploadImage,
  getImageUrl,
};
