import {decrypt, encrypt} from './../encryptUtil';
import sha256 from 'crypto-js/sha256';
import {AES} from 'crypto-js';
import utf8 from 'crypto-js/enc-utf8';

describe('test AES encryption', () => {
  it('初始状态聊天信息为空', () => {
    const message = 'hello world';
    const hashDigest = sha256(message);
    console.log(hashDigest);
  });

  it('AES encryption', () => {
    var encrypted = AES.encrypt(
      'Hello Encrypted World!',
      'my secretqq key',
    ).toString();
    var decrypted = AES.decrypt(encrypted, 'my secretqq key').toString(utf8);

    console.log('Encrypted: ' + encrypted);
    console.log('Decrypted: ' + decrypted);
  });

  it('encryption util', () => {
    interface IMessage {
      id: number;
      content: string;
    }

    const message: IMessage = {
      id: 1,
      content: 'hello world',
    };

    const secretKey = 'my secret key';
    const encrypted = encrypt(JSON.stringify(message), secretKey);
    const obj = decrypt(encrypted, secretKey);

    console.log('Encrypted: ' + encrypted);
    console.log('Decrypted: ' + obj);
  });
});
