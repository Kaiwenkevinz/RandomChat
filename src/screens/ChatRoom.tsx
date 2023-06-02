import {View, FlatList, TextInput, Pressable, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation/types';
import {styles} from '../utils/styles';
import {MessageComponent} from '../components/MessageComponent';
import {MessagePack} from '../types/network/types';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectRooms} from '../store/chatSlice';

type ChatRoomProps = NativeStackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const navigation = useNavigation();
  const params = route.params;
  const {roomId, otherUserId, user, ws} = params;

  const title = `${otherUserId} (remaining: 9:59s)`;

  const [currentMessage, setCurrentMessage] = useState<string>('');

  const messages =
    useAppSelector(selectRooms).find(room => room.roomId === roomId)
      ?.messages || [];
  const [messageHistory, _] = useState<MessagePack[]>(messages);

  useEffect(() => {
    navigation.setOptions({title});
  }, [navigation, title]);

  const handleSendMessage = () => {
    // send message to server

    // TODO: 生成消息包
    const mockMessagePack: MessagePack = {
      msgId: '1a',
      text: currentMessage,
      timestamp: 1684930783,
      sendId: 'Novu Hangouts',
      receiveId: 'Kevin',
      isSent: false,
    };

    if (ws.readyState !== WebSocket.OPEN) {
      console.log('Error! WebSocket not connected!');
      return;
    }

    ws.send(JSON.stringify(mockMessagePack));
  };

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10},
        ]}>
        {messageHistory && messageHistory.length > 0 ? (
          <FlatList
            data={messageHistory}
            renderItem={({item}) => (
              <MessageComponent
                msgId={item.msgId}
                text={item.text}
                sendId={item.sendId}
                receiveId={item.receiveId}
                user={user}
                timestamp={item.timestamp}
                isSent={item.isSent}
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
