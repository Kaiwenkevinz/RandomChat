import {View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {styles} from '../utils/styles';
import {ChatComponentProps, MessagePack, User} from '../types/network/types';

type ChatListComponentProps = Pick<
  ChatComponentProps,
  'roomId' | 'otherUserId'
> & {
  messages: MessagePack[];
  user: User;
};

/**
 * Item component for Chat list
 */
export const ChatListComponent = ({
  roomId,
  otherUserId,
  user,
  messages,
}: ChatListComponentProps) => {
  const navigation = useNavigation();
  const latestMessage = messages[messages.length - 1] || {text: ''};
  const date = new Date(latestMessage.timestamp * 1000);

  const handlePress = () => {
    navigation.navigate('ChatRoom', {
      roomId,
      otherUserId,
      user,
      messages,
    });
  };

  return (
    <Pressable style={styles.cchat} onPress={handlePress}>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{otherUserId}</Text>
          <Text style={styles.cmessage}>{latestMessage.text}</Text>
        </View>
        <View>
          <Text style={styles.ctime}>{date.toLocaleTimeString()}</Text>
        </View>
      </View>
    </Pressable>
  );
};
