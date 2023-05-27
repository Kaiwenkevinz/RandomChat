import {View, FlatList, TextInput, Pressable, Text} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation/types';
import {styles} from '../utils/styles';
import {MessageComponent} from '../network/components/MessageComponent';
import {ChatService} from '../network/lib/message';
import {MessageType} from '../types/network/types';

const NEW_MESSAGE_EVENT = 'new_message_event';
const MESSAGE_SENT_SUCCESS_EVENT = 'message_sent_success_event';
const WEB_SOCKET_URL = 'ws://localhost:8080';

/**
 * readyState
 * 0 (WebSocket.CONNECTING) 正在链接中
 * 1 (WebSocket.OPEN) 已经链接并且可以通讯
 * 2 (WebSocket.CLOSING) 连接正在关闭
 * 3 (WebSocket.CLOSED) 连接已关闭或者没有链接成功
 */
const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;

type ChatRoomProps = NativeStackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const params = route.params;
  const {roomId} = params;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const webSocketRef = useRef<WebSocket>(new WebSocket(WEB_SOCKET_URL));

  const fetchMessages = async () => {
    const res = await ChatService.getMessages(roomId);
    const fetchedMessages = res.data.messages;
    setMessages(fetchedMessages);
  };

  useEffect(() => {
    fetchMessages().catch(console.error);
  }, []);

  const handleSendMessage = () => {
    if (webSocketRef.current && webSocketRef.current.readyState === OPEN) {
      const data = {
        roomId,
        text: currentMessage,
      };
      webSocketRef.current.send(JSON.stringify(data));

      console.log('Send message: ' + JSON.stringify(data));
    }

    return;
  };

  useEffect(() => {
    if (!webSocketRef.current) {
      return;
    }

    const ws = webSocketRef.current;

    ws.onopen = () => {
      // connection opened
    };

    ws.onmessage = e => {
      // a message was received
      
      console.log(e.data);
    };

    ws.onerror = e => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = e => {
      // connection closed
      console.log(e.code, e.reason);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10},
        ]}>
        {messages && messages.length > 0 ? (
          <FlatList
            data={messages}
            renderItem={({item}) => (
              <MessageComponent
                msgId={item.msgId}
                text={item.text}
                userSend={item.userSend}
                userReceive={item.userReceive}
                time={item.time}
              />
            )}
            keyExtractor={item => item.msgId}
          />
        ) : (
          ''
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          style={styles.messaginginput}
          onChangeText={v => setCurrentMessage(v)}
        />
        <Pressable
          style={styles.messagingbuttonContainer}
          onPress={handleSendMessage}>
          <View>
            <Text style={{color: '#f2f0f1', fontSize: 20}}>SEND</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default ChatRoom;
