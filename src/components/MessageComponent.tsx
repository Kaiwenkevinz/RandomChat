import {View, Text, Image, StyleSheet, Pressable, Modal} from 'react-native';
import React, {useState} from 'react';
import {IMessagePackReceive} from '../types/network/types';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/userSlice';
import CircleImage from './CircleImage';
import ImageViewer from 'react-native-image-zoom-viewer';

type MessageComponentProps = IMessagePackReceive & {
  otherUserAvatarUrl: string;
  userAvatarUrl: string;
};

export function MessageComponent({
  message_type: type,
  content,
  otherUserAvatarUrl,
  userAvatarUrl,
  sender_id: sendId,
  send_time: timestamp,
  isSent,
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
    },
  ];

  const handleImagePress = () => {
    setImageViewVisible(true);
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
                      backgroundColor: 'rgb(194, 243, 194)',
                      alignSelf: 'flex-end',
                    },
                  ]
            }>
            {type === 'text' ? (
              <Text>{content}</Text>
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
            {!isReceive && <Text>{sent ? 'Sent' : 'Sending'}</Text>}
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
  },
  messageAndTime: {
    // flex: 1,
  },
  mmessage: {
    flex: 1,
    maxWidth: '80%',
    backgroundColor: '#f5ccc2',
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
