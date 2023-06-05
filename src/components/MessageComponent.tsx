import {View, Text} from 'react-native';
import React from 'react';
import {styles} from '../utils/styles';
import {MessagePack, User} from '../types/network/types';

type MessageComponentProps = MessagePack & {user: User};

export function MessageComponent({
  msgId,
  text,
  sendId,
  receiveId,
  user,
  timestamp,
}: MessageComponentProps) {
  const isReceive = user.username !== sendId;
  const date = new Date(timestamp);

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
          </View>
        </View>
        <Text style={{marginLeft: 40}}>{date.toLocaleString()}</Text>
      </View>
    </View>
  );
}
