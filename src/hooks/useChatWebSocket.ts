import {MessagePackReceive, MessagePackSend} from './../types/network/types';
import {useEffect, useRef} from 'react';
import {store} from '../store/store';
import {updateMessageStatus} from '../store/chatSlice';
import {useAppSelector} from './customReduxHooks';
import {selectUser} from '../store/userSlice';

const useChatWebSocket = (token: string) => {
  // const websocket = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;
  const {id: userId} = useAppSelector(selectUser).user;

  // TODO: 抽取
  const URL = `ws://localhost:8080/chat/${userId}`;
  const websocket = useRef<WebSocket>(
    new WebSocket(URL, null, {
      headers: {Authorization: `Bearer ${token}`},
    }),
  ).current;
  console.log('websocket 连接 url:', URL);

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
    const message: MessagePackSend = JSON.parse(e.data);

    console.log(`服务器 ack message: ${JSON.stringify(message, null, 2)}`);

    let otherUserId;
    if (message.toId === userId) {
      otherUserId = message.fromId;
    } else {
      otherUserId = message.toId;
    }
    const msgId = message.id;

    // set message status to sent
    store.dispatch(updateMessageStatus({otherUserId, msgId}));
  };

  return {websocket};
};

export {useChatWebSocket};
