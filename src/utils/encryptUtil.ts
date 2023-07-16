import md5 from 'blueimp-md5';
import {AES} from 'crypto-js';
import utf8 from 'crypto-js/enc-utf8';

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
