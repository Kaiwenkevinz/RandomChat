import {MessagePackReceive} from './../types/network/types';
import {useEffect, useRef} from 'react';
import {store} from '../store/store';
import {updateMessageStatus} from '../store/chatSlice';
import {useAppSelector} from './customReduxHooks';
import {selectUser} from '../store/userSlice';

const useChatWebSocket = (token: string) => {
  // const websocket = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;
  const {id: userId} = useAppSelector(selectUser).user;

  // TODO: 抽取
  const URL = `ws://10.68.62.219:8080/chat/${userId}`;
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
    const message: MessagePackReceive = JSON.parse(e.data);
    console.log(
      '🚀 ~ file: useChatWebSocket.ts:31 ~ handleOnReceiveWebSocketMessage ~ message:',
      message,
    );
    let otherUserId;
    if (message.sender_id === userId) {
      otherUserId = message.receiver_id;
    } else {
      otherUserId = message.sender_id;
    }
    const msgId = message.id;

    // set message status to sent
    store.dispatch(updateMessageStatus({otherUserId, msgId}));
  };

  return {websocket};
};

export {useChatWebSocket};
