import {useEffect, useRef} from 'react';
import {WEB_SOCKET_URL, WS_EVENT_MSG_ACK} from '../constant';
import {MessagePack} from '../types/network/types';
import {useAppSelector} from './customReduxHooks';
import {selectRooms} from '../store/chatSlice';

const useChatWebSocket = () => {
  const ws = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;

  // init Websocket
  useEffect(() => {
    ws.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    ws.onmessage = e => {
      handleOnReceiveWebSocketMessage(e);
    };
    ws.onclose = () => {
      console.log('WebSocket Client Disconnected');
    };
    return () => {
      ws.close();
    };
  }, []);

  const handleOnReceiveWebSocketMessage = (e: MessageEvent<any>) => {
    // if the message pack has loading, set loading to false
    const messagePack: MessagePack = JSON.parse(e.data);

    // message sent successfully, set isSent to true
    // TODO: add action

  };

  const sendWebSocketMessage = (message: MessagePack) => {
    if (ws.readyState !== WebSocket.OPEN) {
      console.log('Error! WebSocket not connected!');

      return;
    }
    ws.send(JSON.stringify(message));
  };

  return {ws, sendWebSocketMessage};
};

export {useChatWebSocket};
