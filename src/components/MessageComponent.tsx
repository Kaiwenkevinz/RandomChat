import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {IMessagePackReceive} from '../types/network/types';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/userSlice';
import UserAvatar from 'react-native-user-avatar';

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

  return (
    <View style={styles.container}>
      <View
        style={[
          isReceive ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'},
          {alignItems: 'center'},
        ]}>
        <UserAvatar
          bgColor="#F2F2F2"
          size={50}
          name={'Other User'}
          src={isReceive ? otherUserAvatarUrl : userAvatarUrl}
          styles={{marginHorizontal: 20}}
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
              <Image
                source={{
                  uri: content,
                }}
                resizeMode="center"
                style={styles.messageImage}
              />
            )}
            <Text>{sent ? 'Sent' : 'Sending'}</Text>
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
    flex: 1,
  },
  mmessage: {
    flex: 1,
    maxWidth: '70%',
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
    width: 100,
    height: 100,
  },
});
