import {useEffect, useRef} from 'react';
import {WEB_SOCKET_URL} from '../constant';
import {MessagePack} from '../types/network/types';

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
    // if the message pack has loading, set loading to false
    console.log(
      '🚀 ~ file: useChatWebSocket.ts:31 ~ handleOnReceiveWebSocketMessage ~ e:',
      e,
    );
    const messagePack: MessagePack = JSON.parse(e.data);

    // message sent successfully, set isSent to true
    // TODO: add action
  };

  return {websocket};
};

export {useChatWebSocket};
