import jwt_decode from 'jwt-decode';
import md5 from 'blueimp-md5';
import {AES} from 'crypto-js';
import utf8 from 'crypto-js/enc-utf8';
import {KEYCHAIN_KEY_SECRET_KEY} from './constant';
import {loadKeychainData} from './storageUtil';
import {IMessagePackReceive} from '../types/network/types';

export const hashMd5 = (message: string) => {
  return md5(message);
};

export const encrypt = (message: string, key: string) => {
  const encrypted = AES.encrypt(message, key).toString();

  return encrypted;
};

export const decrypt = (encrypted: string, key: string) => {
  const decrypted = AES.decrypt(encrypted, key).toString(utf8);

  return decrypted;
};

export const isExpiredJWT = (token: string) => {
  const decoded: any = jwt_decode(token);
  console.log('decoded JWT: ', decoded, ', expire_sec: ', decoded.expire_sec);

  if (decoded.expire_sec < Date.now() / 1000) {
    return true;
  }

  return false;
};

export const decryptMessages = async (messagePacks: IMessagePackReceive[]) => {
  const secretKey = await loadKeychainData(KEYCHAIN_KEY_SECRET_KEY);
  messagePacks.forEach(messagePack => {
    messagePack.content = decrypt(messagePack.content, secretKey);
  });
};
