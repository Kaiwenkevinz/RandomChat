import {View, Text} from 'react-native';
import React from 'react';
import {styles} from '../../utils/styles';
import {MessageType} from '../../types/network/types';

export function MessageComponent({
  id,
  text,
  userSend,
  userReceive,
  time,
}: MessageType) {
  // TODO: get the current user from local storage
  const user = 'David';

  const isReceive = user !== userSend;

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
        <Text style={{marginLeft: 40}}>{time}</Text>
      </View>
    </View>
  );
}
