import {View, Text, Image} from 'react-native';
import React from 'react';
import {styles} from '../utils/styles';
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
    <View>
      <View
        style={
          isReceive
            ? styles.mmessageWrapper
            : [styles.mmessageWrapper, {alignItems: 'flex-end'}]
        }>
        <View
          style={[
            isReceive ? {flexDirection: 'row'} : {flexDirection: 'row-reverse'},
            {alignItems: 'center'},
          ]}>
          <UserAvatar
            bgColor="#fff"
            size={50}
            name={'Other User'}
            src={isReceive ? otherUserAvatarUrl : userAvatarUrl}
            style={styles.cavatar}
          />
          <View
            style={
              isReceive
                ? styles.mmessage
                : [styles.mmessage, {backgroundColor: 'rgb(194, 243, 194)'}]
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
        </View>
        <Text style={{marginLeft: 40}}>{date.toLocaleString()}</Text>
      </View>
    </View>
  );
}
