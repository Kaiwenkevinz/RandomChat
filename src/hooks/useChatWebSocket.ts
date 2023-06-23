import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {MessagePackSend} from './../types/network/types';
import {useEffect} from 'react';
import {store} from '../store/store';
import {
  appendNewMessage,
  updateMessageStatus,
  updateRoomUnreadStatus,
} from '../store/chatSlice';
import {useAppSelector} from './customReduxHooks';
import {selectUser} from '../store/userSlice';
import {generateReceiveMessagePack} from '../screens/chat-room/chatUtil';
import eventEmitter from '../services/event-emitter';
import {EVENT_SERVER_PUSH_MESSAGE} from '../services/event-emitter/constants';
import {CONFIG} from '../config';

const useChatWebSocket = (token: string) => {
  // const websocket = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;
  const {id: userId} = useAppSelector(selectUser).user;

  const url = `${CONFIG.BASE_WEB_SOCKET_URL}/chat/${userId}`;

  // init Websocket
  useEffect(() => {
    WebSocketSingleton.initWebsocket(url, token);
    const websocket = WebSocketSingleton.getWebsocket();

    if (!websocket) {
      console.error('websocket 未初始化');
      return;
    }

    websocket.onmessage = e => {
      handleOnReceiveWebSocketMessage(userId, e);
    };

    return () => {
      websocket.close();
    };
  }, []);
};

const handleOnReceiveWebSocketMessage = (
  userId: number,
  e: WebSocketMessageEvent,
) => {
  const message: MessagePackSend = JSON.parse(e.data);

  if (message.fromId === userId) {
    // 服务器 ack 消息
    console.log('服务器 ack message:', message);

    let otherUserId;
    if (message.toId === userId) {
      otherUserId = message.fromId;
    } else {
      otherUserId = message.toId;
    }
    store.dispatch(updateMessageStatus({otherUserId, msgId: message.id}));
  } else {
    // 服务器 push 消息
    console.log('服务器 push message: ', message);
    const messagePackReceive = generateReceiveMessagePack(
      message.id,
      message.content,
      message.fromId,
      message.toId,
      message.type,
      message.isGroup,
      true,
    );
    // 添加新消息
    store.dispatch(appendNewMessage(messagePackReceive));
    // 聊天室置为未读状态
    store.dispatch(
      updateRoomUnreadStatus({
        otherUserId: message.fromId,
        hasUnreadMessage: true,
      }),
    );
    // 如果在对应的聊天室，会把状态置为已读
    eventEmitter.emit(EVENT_SERVER_PUSH_MESSAGE, messagePackReceive);
  }
};

export {useChatWebSocket, handleOnReceiveWebSocketMessage};
