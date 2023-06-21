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
import {generateSendMessagePack} from './chatUtil';
import {store} from '../../store/store';
import {selectUser} from '../../store/userSlice';

type ChatRoomProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const navigation = useNavigation();

  // get params from route
  const params = route.params;
  const {otherUserId, otherUserName, otherUserAvatarUrl, websocket} = params;

  // the title of the chat room which shows timer countdown
  const title = `${otherUserName} (remaining: 9:59s)`;

  // the message that is currently being typed
  const [currentMessage, setCurrentMessage] = useState<string>('');

  const user = useAppSelector(selectUser).user;
  const userId = user.id;
  const userAvatarUrl = user?.avatar_url || '';

  // Select state from Redux store
  const {data: rooms} = useAppSelector(selectRooms);
  const messages =
    rooms.find(room => room.otherUserName === otherUserName)?.messages || [];

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

    // 用于发送的消息体和用于展示的消息体的字段不一样，所以需要生成两个消息体，一个发送，一个展示
    const messagePack = generateSendMessagePack(
      'text',
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
            style={{flexGrow: 0}}
            inverted
            data={[...messages].reverse()}
            renderItem={({item}) => (
              <MessageComponent
                id={item.id}
                otherUserAvatarUrl={otherUserAvatarUrl}
                userAvatarUrl={userAvatarUrl}
                content={item.content}
                sender_id={item.sender_id}
                receiver_id={item.receiver_id}
                send_time={item.send_time}
                isSent={item.isSent}
              />
            )}
            keyExtractor={item => item.id}
          />
        ) : (
          ''
        )}
      </View>

      <View style={styles.messaginginputContainer}>
        <TextInput
          style={styles.messaginginput}
          value={currentMessage}
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
