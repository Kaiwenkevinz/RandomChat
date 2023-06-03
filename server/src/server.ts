import express from 'express';
import * as http from 'http';
import * as WebSocket from 'ws';

const app = express();
const server = http.createServer(app);
const webSocketServer = new WebSocket.Server({server});

webSocketServer.on('connection', (webSocket: WebSocket) => {
  console.log('Server is connected');

  webSocket.on('message', (message: string) => {
    console.log('Message from client :: ' + message);
    webSocket.send(message);
  });
});

webSocketServer.on('close', () => {
  console.log('Client disconnected');
});

server.listen(process.env.PORT || 8080, () => {
  console.log('Server started');
});
