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
    webSocket.send(strObj);

    // 模拟服务器向客户端发送消息
    setInterval(() => {
      obj.text = 'Hi Kevin';
      obj.sendId = 'Novu Hangouts';
      obj.receiveId = 'Kevin';
      webSocket.send(JSON.stringify(obj));
    }, 2000);
  });
});

webSocketServer.on('close', () => {
  console.log('Client disconnected');
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
