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
import {generateReceiveMessagePack, generateSendMessagePack} from './chatUtil';
import {store} from '../../store/store';
import {selectUser} from '../../store/userSlice';
import ImagePickerModal from './ImagePickerModal';
import {
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';
import {chatService} from '../../network/lib/message';
import {MessagePackSend} from '../../types/network/types';

type ChatRoomProps = StackScreenProps<RootStackParamList, 'ChatRoom'>;

const ChatRoom = ({route}: ChatRoomProps) => {
  const [visible, setVisible] = useState(false);

  const onImageLibraryPress = async () => {
    const options = {
      selectionLimit: 1,
      mediaType: 'photo',
      includeBase64: false,
    } as ImageLibraryOptions;

    const result = await launchImageLibrary(options);
    if (result.didCancel || !result.assets || result.assets.length === 0) {
      console.log('用户取消了图片选择, 原因: ', result.errorCode);

      return;
    }

    let uri = result.assets[0].uri;
    if (uri === undefined) {
      uri = '';
      console.log('uri is undefined, 不应该 happen');
    }

    // upload uri to server, get url of image
    const resp = await chatService.uploadImage(
      uri,
      `${userId}_${otherUserId}_${Date.now()}`,
    );
    const imageUrl = resp.data;

    setVisible(false);

    // send image url to server
    realSendMessage('image', imageUrl);
  };

  const onCameraPress = async () => {
    const options = {
      saveToPhotos: true,
      mediaType: 'photo',
      includeBase64: false,
    } as ImageLibraryOptions;

    const result = await launchCamera(options);
    console.log('🚀 ~ file: ChatRoom.tsx:59 ~ onCameraPress ~ result:', result);
    if (result.didCancel || !result.assets || result.assets.length === 0) {
      console.log('用户取消了照相机, 原因: ', result.errorCode);

      return;
    }

    let uri = result.assets[0].uri;
    if (uri === undefined) {
      uri = '';
      console.log('uri is undefined, 不应该 happen');
    }

    // TODO: 照相机拍照后, 上传到服务器
  };

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
    realSendMessage('text', currentMessage);
    setCurrentMessage('');
  };

  const realSendMessage = (type: MessagePackSend['type'], content: string) => {
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
            renderItem={({item}) => {
              console.log('item', item.message_type);

              return (
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
              );
            }}
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
            <Text style={{color: '#f2f0f1', fontSize: 14}}>SEND</Text>
          </View>
        </Pressable>
        <Pressable
          style={styles.messagingbuttonContainer}
          onPress={() => setVisible(true)}>
          <View>
            <Text style={{color: '#f2f0f1', fontSize: 12}}>Send Image</Text>
          </View>
        </Pressable>
      </View>

      <ImagePickerModal
        isVisible={visible}
        onClose={() => setVisible(false)}
        onImageLibraryPress={onImageLibraryPress}
        onCameraPress={onCameraPress}
      />
    </View>
  );
};

export default ChatRoom;
