import {View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {styles} from '../../utils/styles';
import {ChatComponentProps, MessageType, User} from '../../types/network/types';

type ChatListComponentProps = Pick<
  ChatComponentProps,
  'roomId' | 'otherUser'
> & {message: MessageType} & {user: User};

/**
 * Item component for Chat list
 */
export const ChatListComponent = ({
  roomId,
  otherUser,
  user,
  message,
}: ChatListComponentProps) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ChatRoom', {roomId, user});
  };

  return (
    <Pressable style={styles.cchat} onPress={handlePress}>
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{otherUser}</Text>
          <Text style={styles.cmessage}>
            {message.text ? message.text : 'Tap to start chatting'}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>{message.time}</Text>
        </View>
      </View>
    </Pressable>
  );
};
