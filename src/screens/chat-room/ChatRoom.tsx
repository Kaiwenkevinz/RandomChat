import {View, FlatList, TextInput, Pressable, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../../utils/styles';
import {MessageComponent} from '../../components/MessageComponent';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {appendNewMessage, selectRooms} from '../../store/chatSlice';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation/types';
import {showToast} from '../../utils/toastUtil';
import {toastType} from '../../utils/toastUtil';
import {generateMessagePack} from './chatUtil';
import {store} from '../../store/store';
import {selectUser} from '../../store/userSlice';

type ChatRoomProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const navigation = useNavigation();

  // get params from route
  const params = route.params;
  const {otherUserId, websocket} = params;

  // the title of the chat room which shows timer countdown
  const title = `${otherUserId} (remaining: 9:59s)`;

  // the message that is currently being typed
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const {id: userId, username} = useAppSelector(selectUser).userInfo;

  // Select state from Redux store
  const {rooms} = useAppSelector(selectRooms);
  const messages =
    rooms.find(room => room.otherUserId === otherUserId)?.messages || [];

  // set the title of the chat room
  useEffect(() => {
    navigation.setOptions({title});
    console.log('ChatRoom mounted');

    return () => {
      console.log('ChatRoom unmounted');
    };
  }, [navigation, title]);

  const handleSendMessage = () => {
    if (websocket.readyState !== WebSocket.OPEN) {
      showToast(toastType.ERROR, 'Error', 'Error! WebSocket not connected!');
      console.log('Error! WebSocket not connected!');
      return;
    }

    const messagePack = generateMessagePack(
      currentMessage,
      userId,
      otherUserId,
    );

    websocket.send(JSON.stringify(messagePack));
    store.dispatch(appendNewMessage(messagePack));

    console.log('should clear input');
    setCurrentMessage('');
  };

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingVertical: 15, paddingHorizontal: 10},
        ]}>
        {messages && messages.length > 0 ? (
          <FlatList
            inverted
            data={[...messages].reverse()}
            renderItem={({item}) => (
              <MessageComponent
                msgId={item.msgId}
                text={item.text}
                sendId={item.sendId}
                receiveId={item.receiveId}
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
