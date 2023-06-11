import {View, Text} from 'react-native';
import React from 'react';
import {styles} from '../utils/styles';
import {MessagePack} from '../types/network/types';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/userSlice';

type MessageComponentProps = MessagePack;

export function MessageComponent({
  text,
  sendId,
  timestamp,
  isSent,
}: MessageComponentProps) {
  const userInfo = useAppSelector(selectUser);
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
