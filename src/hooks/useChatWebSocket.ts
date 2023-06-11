import {MessagePack} from './../types/network/types';
import {useEffect, useRef} from 'react';
import {WEB_SOCKET_URL} from '../constant';
import {store} from '../store/store';
import {setMessageStatusToSent} from '../store/chatSlice';
import {useAppSelector} from './customReduxHooks';
import {selectUser} from '../store/userSlice';

const useChatWebSocket = () => {
  const websocket = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;

  const {id: userId} = useAppSelector(selectUser).userInfo;

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
    const message: MessagePack = JSON.parse(e.data);
    console.log(
      '🚀 ~ file: useChatWebSocket.ts:31 ~ handleOnReceiveWebSocketMessage ~ message:',
      message,
    );
    let otherUserId = '';
    if (message.sendId === userId) {
      otherUserId = message.receiveId;
    } else {
      otherUserId = message.sendId;
    }
    const msgId = message.msgId;

    // set message status to sent
    store.dispatch(setMessageStatusToSent({otherUserId, msgId}));
  };

  return {websocket};
};

export {useChatWebSocket};
