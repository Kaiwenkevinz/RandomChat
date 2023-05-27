import {View, FlatList, TextInput, Pressable, Text} from 'react-native';
import React, {createContext, useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation/types';
import {styles} from '../utils/styles';
import {MessageComponent} from '../network/components/MessageComponent';
import {ChatService} from '../network/lib/message';
import {MessageType} from '../types/network/types';

type ChatRoomProps = NativeStackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const params = route.params;
  const {roomId} = params;

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const fetchMessages = async () => {
    const res = await ChatService.getMessages(roomId);
    const fetchedMessages = res.data.messages;
    setMessages(fetchedMessages);
  };

  useEffect(() => {
    fetchMessages().catch(console.error);
  }, []);

  const handleSendMessage = () => {
    console.log('Send message: ' + currentMessage);

    return;
  };

  // useEffect(() => {
  //   const ws = new WebSocket('ws://host.com/path');

  //   ws.onopen = () => {
  //     // connection opened
  //     ws.send('something'); // send a message
  //   };

  //   ws.onmessage = e => {
  //     // a message was received
  //     console.log(e.data);
  //   };

  //   ws.onerror = e => {
  //     // an error occurred
  //     console.log(e.message);
  //   };

  //   ws.onclose = e => {
  //     // connection closed
  //     console.log(e.code, e.reason);
  //   };
  // }, []);

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
