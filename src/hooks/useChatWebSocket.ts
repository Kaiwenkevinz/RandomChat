import {MessagePack} from './../types/network/types';
import {useEffect, useRef} from 'react';
import {WEB_SOCKET_URL} from '../constant';
import {store} from '../store/store';
import {appendNewMessage} from '../store/chatSlice';

const useChatWebSocket = () => {
  const websocket = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;

  // init Websocket
  useEffect(() => {
    websocket.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    websocket.onmessage = e => {
      handleOnReceiveWebSocketMessage(e);
    };
    websocket.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };
    return () => {
      websocket.close();
    };
  }, []);

  const handleOnReceiveWebSocketMessage = (e: WebSocketMessageEvent) => {
    // TODO: Add action: set message isSent to true
    console.log(
      '🚀 ~ file: useChatWebSocket.ts:31 ~ handleOnReceiveWebSocketMessage ~ e:',
      e.data,
    );
    const message: MessagePack = JSON.parse(e.data);
    console.log(
      '🚀 ~ file: useChatWebSocket.ts:31 ~ handleOnReceiveWebSocketMessage ~ message:',
      message,
    );

    store.dispatch(appendNewMessage(message));
  };

  return {websocket};
};

export {useChatWebSocket};
