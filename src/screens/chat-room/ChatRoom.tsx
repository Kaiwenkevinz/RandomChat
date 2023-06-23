import {View, FlatList, TextInput, Pressable, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from '../../utils/styles';
import {MessageComponent} from '../../components/MessageComponent';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {
  appendNewMessage,
  selectRooms,
  updateRoomUnreadStatus,
} from '../../store/chatSlice';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../../types/navigation/types';
import {showToast} from '../../utils/toastUtil';
import {toastType} from '../../utils/toastUtil';
import {generateReceiveMessagePack, generateSendMessagePack} from './chatUtil';
import {store} from '../../store/store';
import {selectUser} from '../../store/userSlice';
import ImagePickerModal from './ImagePickerModal';
import {IMessagePackReceive, MessagePackSend} from '../../types/network/types';
import {WebSocketSingleton} from '../../services/event-emitter/WebSocketSingleton';
import eventEmitter from '../../services/event-emitter';
import {EVENT_SERVER_PUSH_MESSAGE} from '../../services/event-emitter/constants';

type ChatRoomProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // get params from route
  const params = route.params;
  const {otherUserId, otherUserName, otherUserAvatarUrl} = params;

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
    console.log('ChatRoom mounted');
    navigation.setOptions({title});
    setUnreadStatus();

    eventEmitter.on(
      EVENT_SERVER_PUSH_MESSAGE,
      (messagePack: IMessagePackReceive) => {
        // 判断消息是不是对方发给我的
        if (messagePack.receiver_id !== userId) {
          return;
        }

        setUnreadStatus();
      },
    );

    return () => {
      console.log('ChatRoom unmounted');
    };
  }, [navigation, title]);

  const setUnreadStatus = () => {
    // 更新聊天室为已读状态
    store.dispatch(
      updateRoomUnreadStatus({otherUserId, hasUnreadMessage: false}),
    );
  };

  const handleSendText = () => {
    realSendMessage('text', currentMessage);
    setCurrentMessage('');
  };

  const handleSendImage = (imageUrl: string) => {
    realSendMessage('image', imageUrl);
  };

  const realSendMessage = (type: MessagePackSend['type'], content: string) => {
    const websocket = WebSocketSingleton.getWebsocket();
    if (!websocket || websocket.readyState !== WebSocket.OPEN) {
      showToast(toastType.ERROR, 'Error', 'Error! WebSocket not connected!');
      console.log('Error! WebSocket not connected!');
      return;
    }

    // 用于发送的消息体和用于展示的消息体的字段不一样，所以需要生成两个消息体，一个发送，一个展示
    const messagePackToSend = generateSendMessagePack(
      content,
      userId,
      otherUserId,
      type,
    );
    const messagePackToShow = generateReceiveMessagePack(
      messagePackToSend.id,
      messagePackToSend.content,
      messagePackToSend.fromId,
      messagePackToSend.toId,
      messagePackToSend.type,
    );

    websocket.send(JSON.stringify(messagePackToSend));
    store.dispatch(appendNewMessage(messagePackToShow));
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
                message_type={item.message_type}
                isGroup={item.isGroup}
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
          onPress={handleSendText}>
          <View>
            <Text style={{color: '#f2f0f1', fontSize: 14}}>SEND</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.messagingbuttonContainer}
          onPress={() => setModalVisible(true)}>
          <View>
            <Text style={{color: '#f2f0f1', fontSize: 12}}>Send Image</Text>
          </View>
        </Pressable>
      </View>

      <ImagePickerModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirmImage={handleSendImage}
        imageName={`${userId}_${otherUserId}`}
      />
    </View>
  );
};

export default ChatRoom;
