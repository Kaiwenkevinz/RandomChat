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

  const messageFromOther = {
    type: 'text',
    id: 'server-message-1',
    content: 'Hello, 我是 server 转发来的其他人的消息',
    fromId: 200,
    toId: 1,
    isGroup: 0,
  };
  setTimeout(() => {
    console.log('Server 发送消息', messageFromOther);
    webSocket.send(JSON.stringify(messageFromOther));
  }, 5000);
});

webSocketServer.on('close', () => {
  console.log('Client disconnected');
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
