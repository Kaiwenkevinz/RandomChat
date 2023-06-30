import {View, FlatList, TextInput, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {MessageComponent} from '../../components/MessageComponent';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {
  appendNewMessage,
  operateUnreadRoomAsync,
  selectRooms,
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
import DebounceButton from '../../components/DebounceButton';

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
    rooms.find(room => room.otherUserId === otherUserId)?.messages || [];

  const onServerPushMessage = (messagePack: IMessagePackReceive) => {
    // 判断消息是不是对方发给我的
    if (messagePack.receiver_id !== userId) {
      return;
    }
    setUnreadStatus();
  };

  useEffect(() => {
    console.log('ChatRoom mounted');
    navigation.setOptions({title});
    setUnreadStatus();

    eventEmitter.on(EVENT_SERVER_PUSH_MESSAGE, onServerPushMessage);

    return () => {
      console.log('ChatRoom unmounted');
      eventEmitter.off(EVENT_SERVER_PUSH_MESSAGE, onServerPushMessage);
    };
  }, [navigation, title]);

  const setUnreadStatus = () => {
    store.dispatch(
      operateUnreadRoomAsync({option: 'delete', newData: otherUserId}),
    );
  };

  const handleSendText = () => {
    realSendMessage('text', currentMessage);
    setCurrentMessage('');
  };

  /**
   * 发送图片
   * @param imageUrl 图片在服务器的完整 url
   */
  const handleSendImage = (imageUrl: string) => {
    if (!imageUrl) {
      showToast(toastType.ERROR, 'Error', 'Error! Fail to upload image!');
      return;
    }
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
        <View style={{marginRight: 10}}>
          <DebounceButton text={'Send'} handleOnPress={handleSendText} />
        </View>
        <View style={{marginRight: 10}}>
          <DebounceButton
            text={'Send Image'}
            handleOnPress={() => setModalVisible(true)}
          />
        </View>
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

const styles = StyleSheet.create({
  messagingscreen: {
    flex: 1,
  },
  messaginginputContainer: {
    width: '100%',
    minHeight: 50,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  messaginginput: {
    padding: 15,
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: '#F7F7F7',
  },
});

export default ChatRoom;
