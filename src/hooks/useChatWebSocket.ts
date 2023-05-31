import {useEffect, useRef} from 'react';
import {WEB_SOCKET_URL, WS_EVENT_MSG_ACK} from '../constant';
import {MessageType} from '../types/network/types';

/**
 * 负责消息的发送和接收
 * 消息发送的结果会通过回调函数返回，由上层处理
 *
 * 发送消息到服务器 -> append messackPack to queue
 * 收服务器的 ack -> remove messagePack from queue -> 回调函数通知上层
 */
export type WebSocketMessagePackType = {
  eventType: string;
  messagePack: MessageType;
};

const useChatWebSocket = (
  onServerReceiveMsg: (wsMessagePack: WebSocketMessagePackType) => void,
) => {
  const ws = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL)).current;

  // store messagePack what has not received ack
  const messagesAckPendingMemo = useRef<Map<string, MessageType>>(
    new Map(),
  ).current;

  // init Websocket
  useEffect(() => {
    ws.onopen = () => {
      ws.send('WebSocket Client Connected');
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
    const wsMessagePack: WebSocketMessagePackType = JSON.parse(e.data);
    if (wsMessagePack.eventType === WS_EVENT_MSG_ACK) {
      // remove messagePack from queue
      messagesAckPendingMemo.delete(wsMessagePack.messagePack.msgId);
      onServerReceiveMsg(wsMessagePack);
    }
  };

  const sendWebSocketMessage = (message: MessageType) => {
    if (ws.readyState !== WebSocket.OPEN) {
      console.log('Error! WebSocket not connected!');

      return;
    }
    // append messagePack to queue, waiting for ack
    messagesAckPendingMemo.set(message.msgId, message);
    ws.send(JSON.stringify(message));
  };

  return {ws, sendWebSocketMessage, messagesAckPendingMemo};
};

export {useChatWebSocket};
