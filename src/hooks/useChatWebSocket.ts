import {decrypt} from './../utils/encryptUtil';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {MessagePackSend} from './../types/network/types';
import {useEffect} from 'react';
import {store} from '../store/store';
import {appendNewMessage, updateMessageStatus} from '../store/chat/chatSlice';
import {operateReadRoomAsync} from '../store/chat/thunks/operateReadRoomAsyncThunk';
import {useAppSelector} from './customReduxHooks';
import {generateReceiveMessagePack} from '../screens/chat-room/chatUtil';
import eventEmitter from '../services/event-emitter';
import {
  EVENT_SERVER_PUSH_MESSAGE,
  EVENT_SERVER_REFRESH_SCORE,
} from '../services/event-emitter/constants';
import {CONFIG} from '../config';
import {showToast, toastType} from '../utils/toastUtil';
import {KEYCHAIN_KEY_SECRET_KEY} from '../utils/constant';
import {loadKeychainData} from '../utils/storageUtil';
import {getScoreMemoAsync} from '../store/user/thunks';
import {selectUser} from '../store/user/userSlice';

const useChatWebSocket = (token: string) => {
  const {id: userId} = useAppSelector(selectUser).user;

  let url = `${CONFIG.BASE_WEB_SOCKET_URL}/chat/${userId}`;
  const isDev = process.env.NODE_ENV === 'development';
  const isMock = CONFIG.TURN_ON_MOCK_API === '1';
  if (isDev && isMock) {
    url = `ws://localhost:8080/chat/${userId}`;
  }

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

const handleAckChat = (userId: number, message: MessagePackSend) => {
  console.log('服务器 ack message:', message);

  let otherUserId;
  if (message.toId === userId) {
    otherUserId = message.fromId;
  } else {
    otherUserId = message.toId;
  }
  // 更新消息状态为已发送
  store.dispatch(updateMessageStatus({otherUserId, msgId: message.id}));
};

const handlePushChat = (message: MessagePackSend) => {
  console.log('服务器 push message: ', message);
  const messagePackReceive = generateReceiveMessagePack(
    message.id,
    message.content,
    message.fromId,
    message.toId,
    message.sender_avatar_url,
    message.sender_name,
    message.type,
    message.isGroup,
    true,
  );
  // 添加新消息
  store.dispatch(appendNewMessage(messagePackReceive));

  // 更新已读聊天室
  store
    .dispatch(
      operateReadRoomAsync({
        option: 'delete',
        newData: {
          roomId: messagePackReceive.sender_id,
          msgId: null,
        },
      }),
    )
    .then(() => {
      // 通知收到了新的聊天消息
      eventEmitter.emit(EVENT_SERVER_PUSH_MESSAGE, messagePackReceive);
    });
};

const handleOnReceiveWebSocketMessage = async (
  userId: number,
  e: WebSocketMessageEvent,
) => {
  const message: MessagePackSend = JSON.parse(e.data);
  console.log('Received WebSocket message: ', message);

  if (message.type === 'system') {
    console.log('系统消息', message);
    showToast(toastType.INFO, 'Info', 'Score has been updated');
    eventEmitter.emit(EVENT_SERVER_REFRESH_SCORE);
  } else {
    // 聊天消息
    const secretKey = await loadKeychainData(KEYCHAIN_KEY_SECRET_KEY);
    message.content = decrypt(message.content, secretKey);

    if (message.fromId === userId) {
      handleAckChat(userId, message);
    } else {
      handlePushChat(message);
    }
    store.dispatch(getScoreMemoAsync());
  }
};

export {useChatWebSocket, handleOnReceiveWebSocketMessage};
