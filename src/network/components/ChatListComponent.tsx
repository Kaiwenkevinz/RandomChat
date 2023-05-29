import {View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {styles} from '../../utils/styles';
import {ChatComponentProps, MessageType, User} from '../../types/network/types';

type ChatListComponentProps = Pick<
  ChatComponentProps,
  'roomId' | 'otherUserName'
> & {message: MessageType} & {user: User};

/**
 * Item component for Chat list
 */
export const ChatListComponent = ({
  roomId,
  otherUserName,
  user,
  message,
}: ChatListComponentProps) => {
  const navigation = useNavigation();
  const date = new Date(message.time * 1000);

  const handlePress = () => {
    navigation.navigate('ChatRoom', {roomId, otherUserName, user});
  };

  return (
    <Pressable style={styles.cchat} onPress={handlePress}>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{otherUserName}</Text>
          <Text style={styles.cmessage}>
            {message.text ? message.text : 'Tap to start chatting'}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>{date.toLocaleTimeString()}</Text>
        </View>
      </View>
    </Pressable>
  );
};
