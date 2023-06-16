import {View, Text} from 'react-native';
import React from 'react';
import {styles} from '../utils/styles';
import {MessagePack} from '../types/network/types';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/userSlice';
import UserAvatar from 'react-native-user-avatar';

type MessageComponentProps = MessagePack & {
  otherUserAvatarUrl: string;
  userAvatarUrl: string;
};

export function MessageComponent({
  text,
  otherUserAvatarUrl,
  userAvatarUrl,
  sendId,
  timestamp,
  isSent,
}: MessageComponentProps) {
  const userInfo = useAppSelector(selectUser).userInfo; // TODO: 把 username 改成从props里面拿
  const user = userInfo || {id: '', username: ''};
  const isReceive = user.username !== sendId;
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
            <Text>{text}</Text>
            <Text>{sent ? 'Sent' : 'Sending'}</Text>
          </View>
        </View>
        <Text style={{marginLeft: 40}}>{date.toLocaleString()}</Text>
      </View>
    </View>
  );
}
