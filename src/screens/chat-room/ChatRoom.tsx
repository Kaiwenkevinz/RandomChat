import {
  View,
  FlatList,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {MessageComponent} from '../../components/MessageComponent';
import {useNavigation} from '@react-navigation/native';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {
  IReadRoom,
  appendNewMessage,
  getMessageHistoryAsync,
  operateReadRoomAsync,
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
import {
  EVENT_SERVER_PUSH_MESSAGE,
  EVENT_SERVER_REFRESH_SCORE,
} from '../../services/event-emitter/constants';
import DebounceButton from '../../components/DebounceButton';
import {imageService} from '../../network/lib/imageService';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';

type ChatRoomProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  // get params from route
  const params = route.params;
  const {otherUserId, otherUserName, otherUserAvatarUrl} = params;
  const isLoading =
    useAppSelector(state => state.chat.messageHistoryStatus) === 'loading';

  /**
   * 分页相关
   */
  const pageRef = useRef(1);
  const totalRef = useRef(Infinity);
  const SIZE = 10;

  /**
   * user info
   */
  const user = useAppSelector(selectUser).user;
  const userId = user.id;
  const userAvatarUrl = user?.avatar_url || '';
  const userName = user?.username || '';

  /**
   * 亲密度展示
   */
  const scoreThreshold = useAppSelector(state => state.user.scoreThreshold);
  const scoreMemo = useAppSelector(state => state.user.scoreMemo);
  const score = scoreMemo[otherUserId] || 0;
  const scoreStr =
    score >= scoreThreshold ? '\u{2B50}' : `score: ${score.toString()}`;
  const title = `${otherUserName} (${scoreStr})`;

  // the message that is currently being typed
  const [currentMessage, setCurrentMessage] = useState<string>('');

  // Select state from Redux store
  const {data: rooms} = useAppSelector(selectRooms);
  const messages =
    rooms.find(room => room.otherUserId === otherUserId)?.messages || [];

  const onServerPushMessage = (messagePack: IMessagePackReceive) => {
    // 收到新消息时正好在对应的聊天室，聊天室为已读状态
    if (messagePack.sender_id !== otherUserId) {
      return;
    }
    console.log('发送方id:', messagePack.sender_id);

    addRoomToRead({roomId: otherUserId, msgId: messagePack.id} as IReadRoom);
  };

  const onServerRefreshScore = () => {
    navigation.goBack();
  };

  useEffect(() => {
    console.log('ChatRoom mounted');
    // 刚进入聊天室时，将聊天室标记为已读
    addRoomToRead({roomId: otherUserId, msgId: null} as IReadRoom);

    eventEmitter.on(EVENT_SERVER_PUSH_MESSAGE, onServerPushMessage);
    eventEmitter.on(EVENT_SERVER_REFRESH_SCORE, onServerRefreshScore);

    return () => {
      console.log('ChatRoom unmounted');
      eventEmitter.off(EVENT_SERVER_PUSH_MESSAGE, onServerPushMessage);
      eventEmitter.off(EVENT_SERVER_REFRESH_SCORE, onServerRefreshScore);
    };
  }, []);

  // 亲密度变化时，更新标题
  useEffect(() => {
    navigation.setOptions({title});

    return () => {};
  }, [navigation, title]);

  const handleOnEndReached = async () => {
    // 正在加载，或者没有更多数据了，则不再加载更多数据
    if (isLoading || messages.length >= totalRef.current) {
      return;
    }

    const resp = await store
      .dispatch(
        getMessageHistoryAsync({
          otherUserId,
          page: pageRef.current,
          pageSize: SIZE,
        }),
      )
      .unwrap();

    totalRef.current = resp.result.data.total;
    pageRef.current += 1;
  };

  const addRoomToRead = (newData: IReadRoom | null = null) => {
    store.dispatch(operateReadRoomAsync({option: 'add', newData}));
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
    realSendMessage('image', imageService.getImageUrl(imageUrl));
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
      userAvatarUrl,
      userName,
      otherUserId,
      type,
    );
    const messagePackToShow = generateReceiveMessagePack(
      messagePackToSend.id,
      messagePackToSend.content,
      messagePackToSend.fromId,
      messagePackToSend.toId,
      messagePackToSend.sender_avatar_url,
      messagePackToSend.sender_name,
      messagePackToSend.type,
    );

    websocket.send(JSON.stringify(messagePackToSend));
    store.dispatch(appendNewMessage(messagePackToShow));
    store.dispatch(
      operateReadRoomAsync({
        option: 'add',
        newData: {
          roomId: otherUserId,
          msgId: messagePackToShow.id,
        } as IReadRoom,
      }),
    );
  };

  return (
    <View style={styles.messagingscreen}>
      <View
        style={[
          styles.messagingscreen,
          {paddingTop: 5, paddingHorizontal: 10},
        ]}>
        {messages && messages.length > 0 ? (
          <FlatList
            onEndReachedThreshold={0.5}
            onEndReached={handleOnEndReached}
            ListFooterComponent={
              isLoading ? <ActivityIndicator size="small" /> : null
            }
            style={{flex: 1}}
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: 'flex-end',
            }}
            inverted
            data={[...messages].reverse()}
            renderItem={({item}) => (
              <MessageComponent
                id={item.id}
                otherUserAvatarUrl={otherUserAvatarUrl}
                sender_avatar_url={item.sender_avatar_url}
                sender_name={item.sender_name}
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
        {currentMessage.length > 0 && (
          <View style={{marginRight: 10, justifyContent: 'center'}}>
            <DebounceButton
              text={'Send'}
              fontSize={14}
              handleOnPress={handleSendText}
            />
          </View>
        )}
        <View style={{marginRight: 10, justifyContent: 'center'}}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <AntDesign name="camerao" size={25} />
          </TouchableOpacity>
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
    backgroundColor: '#fff',
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
