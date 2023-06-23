import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {MessagePackSend} from './../types/network/types';
import {useEffect} from 'react';
import {store} from '../store/store';
import {updateMessageStatus} from '../store/chatSlice';
import {useAppSelector} from './customReduxHooks';
import {selectUser} from '../store/userSlice';

const useChatWebSocket = (token: string) => {
  // const websocket = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;
  const {id: userId} = useAppSelector(selectUser).user;

  // TODO: 抽取
  const url = `ws://localhost:8080/chat/${userId}`;

  // init Websocket
  useEffect(() => {
    WebSocketSingleton.initWebsocket(url, token);
    const websocket = WebSocketSingleton.getWebsocket();

    if (!websocket) {
      console.error('websocket 未初始化');
      return;
    }

    websocket.onmessage = e => {
      handleOnReceiveWebSocketMessage(e);
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

    store.dispatch(updateMessageStatus({otherUserId, msgId}));
  };
};

export {useChatWebSocket};
