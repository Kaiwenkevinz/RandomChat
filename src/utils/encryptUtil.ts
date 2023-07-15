import md5 from 'blueimp-md5';

export const hashMd5 = (message: string) => {
  return md5(message);
};
