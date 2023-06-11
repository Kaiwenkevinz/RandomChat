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
});

webSocketServer.on('close', () => {
  console.log('Client disconnected');
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
