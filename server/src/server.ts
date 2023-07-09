import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({server});

webSocketServer.on('connection', (webSocket: WebSocket) => {
  console.log('Server is connected');

  webSocket.on('message', (message: string) => {
    const obj = JSON.parse(message);
    const strObj = JSON.stringify(obj);
    console.log('Client 传来的 message', strObj);

    // 模拟 2秒后 ack
    setTimeout(() => {
      webSocket.send(strObj);
    }, 2000);
  });

  // 测试亲密度刷新
  // setInterval(() => {
  //   const msgObj = {
  //     type: 'system',
  //   };
  //   console.log('Server 发送消息', msgObj);
  //   webSocket.send(JSON.stringify(msgObj));
  // }, 3500);

  const messageFromOther = {
    type: 'text',
    id: 'server-message-' + Math.random().toString(),
    content: 'Hello, 我是 server 转发来的其他人的消息',
    fromId: 200,
    sender_avatar_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
    sender_name: 'Novu Hangouts',
    toId: 1,
    isGroup: 0,
  };
  const messageFromOther2 = {
    type: 'text',
    id: 'server-message-' + Math.random().toString(),
    content: 'Hello, 我是300',
    fromId: 300,
    sender_avatar_url:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-6fdvJtz4yfmwA5pVvP7Q-o-i-tSnp8lapNonInKuREA7eXL95wpwlh9kYx4dalUI5uQ&usqp=CAU',
    sender_name: 'Novu Hangouts',
    toId: 1,
    isGroup: 0,
  };
  setInterval(() => {
    console.log('Server 发送消息', messageFromOther);
    webSocket.send(JSON.stringify(messageFromOther));
  }, 2000);
  setInterval(() => {
    console.log('Server 发送消息', messageFromOther2);
    webSocket.send(JSON.stringify(messageFromOther2));
  }, 4000);

  // // 模拟新好友
  // const messageFromNewFriend = {
  //   type: 'text',
  //   id: 'server-message-1',
  //   content: '我是新好友',
  //   sender_avatar_url:
  //     'https://play-lh.googleusercontent.com/hVLWGjioN3io_eukfF0gP_YMlzpea-YugHDRcAwL6aROwM5q9szGyQwCG_MAXQyU1Dk=w600-h300-pc0xffffff-pd',
  //   sender_name: '新好友',
  //   fromId: 999,
  //   toId: 1,
  //   isGroup: 0,
  // };
  // setInterval(() => {
  //   console.log('Server 发送消息', messageFromNewFriend);
  //   webSocket.send(JSON.stringify(messageFromNewFriend));
  // }, 3500);
});

webSocketServer.on('close', () => {
  console.log('Client disconnected');
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
