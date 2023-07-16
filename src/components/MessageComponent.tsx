import {View, Text, Image, StyleSheet, Pressable, Modal} from 'react-native';
import React, {useState} from 'react';
import {IMessagePackReceive} from '../types/network/types';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/userSlice';
import CircleImage from './CircleImage';
import ImageViewer from 'react-native-image-zoom-viewer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from 'react-native-popup-menu';
import {chatService} from '../network/lib/message';
import {showToast, toastType} from '../utils/toastUtil';

const MENU_OPT_REPLAY = 'Help Me Replay';
const MENU_OPT_TRANSLATE = 'Translate';

type MessageComponentProps = IMessagePackReceive & {
  otherUserAvatarUrl: string;
  userAvatarUrl: string;
  setCurrentMessage: (message: string) => void;
};

export function MessageComponent({
  message_type: type,
  content,
  otherUserAvatarUrl,
  userAvatarUrl,
  sender_id: sendId,
  send_time: timestamp,
  isSent,
  setCurrentMessage,
}: MessageComponentProps) {
  const user = useAppSelector(selectUser).user;
  const isReceive = user.id !== sendId;
  const date = new Date(timestamp);
  const sent = isSent === undefined || isSent;

  const userStore = useAppSelector(selectUser);
  const token = userStore.token;

  const [imageViewVisible, setImageViewVisible] = useState(false);

  const images = [
    {
      url: content,
      freeHeight: true,
      props: {
        source: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      },
    },
  ];

  const handleImagePress = () => {
    setImageViewVisible(true);
  };

  const handleMenuOptionSelect = async (option: string) => {
    const reply = (await chatService.getChatGPT(option, content)).data;
    if (!reply || reply === '') {
      showToast(toastType.INFO, 'Fail', 'Something wrong with the server');
      return;
    }

    setCurrentMessage(reply);
    showToast(toastType.SUCCESS, 'Success', 'Check your message box');
  };

  const renderTextItem = () => {
    const underlayColor = isReceive ? '#F1F1F1' : '#3478F6';
    return (
      <Menu
        renderer={renderers.Popover}
        rendererProps={{preferredPlacement: 'bottom'}}>
        <MenuTrigger
          triggerOnLongPress={true}
          customStyles={{
            triggerTouchable: {underlayColor},
          }}>
          <Text style={!isReceive && {color: '#fff'}}>{content}</Text>
        </MenuTrigger>
        <MenuOptions>
          <MenuOption onSelect={() => handleMenuOptionSelect(MENU_OPT_REPLAY)}>
            <Text style={{color: 'orange'}}>{MENU_OPT_REPLAY}</Text>
          </MenuOption>
          <MenuOption
            onSelect={() => handleMenuOptionSelect(MENU_OPT_TRANSLATE)}>
            <Text style={{color: 'blue'}}>{MENU_OPT_TRANSLATE}</Text>
          </MenuOption>
        </MenuOptions>
      </Menu>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          isReceive ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'},
          {alignItems: 'center'},
        ]}>
        <CircleImage
          size={50}
          avatarUrl={isReceive ? otherUserAvatarUrl : userAvatarUrl}
          borderColor="#fff"
        />
        <View style={styles.messageAndTime}>
          <View
            style={
              isReceive
                ? styles.mmessage
                : [
                    styles.mmessage,
                    {
                      backgroundColor: '#3478F6',
                      alignSelf: 'flex-end',
                    },
                  ]
            }>
            {type === 'text' ? (
              renderTextItem()
            ) : (
              <Pressable onPress={handleImagePress}>
                <Image
                  source={{
                    uri: content,
                    headers: {
                      Authorization: `Bearer ${token}}`,
                    },
                  }}
                  resizeMode="center"
                  style={styles.messageImage}
                />
              </Pressable>
            )}
            {!isReceive && (
              <View>
                {sent ? (
                  <AntDesign name="check" size={10} color={'#fff'} />
                ) : (
                  <AntDesign name="swap" size={10} color={'#fff'} />
                )}
              </View>
            )}
          </View>
          <Text
            style={[
              styles.mtime,
              isReceive
                ? {flexDirection: 'row'}
                : {flexDirection: 'row-reverse', textAlign: 'right'},
            ]}>
            {date.toLocaleString()}
          </Text>
        </View>
      </View>
      <Modal visible={imageViewVisible} transparent={true}>
        <ImageViewer
          imageUrls={images}
          onClick={() => setImageViewVisible(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 15,
    marginHorizontal: 10,
    backgroundColor: '#fff',
  },
  messageAndTime: {
    // flex: 1,
  },
  mmessage: {
    flex: 1,
    maxWidth: '80%',
    backgroundColor: '#F1F1F1',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 2,
  },
  mtime: {
    marginHorizontal: 10,
  },
  messageImage: {
    alignSelf: 'center',
    // flex: 1,
    width: 100,
    height: 100,
  },
});
