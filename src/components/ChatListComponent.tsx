import {View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {styles} from '../utils/styles';
import {ChatComponentProps, MessagePack} from '../types/network/types';
import UserAvatar from 'react-native-user-avatar';

type ChatListComponentProps = Pick<
  ChatComponentProps,
  'otherUserId' | 'otherUserName' | 'otherUserAvatarUrl'
> & {
  messages: MessagePack[];
  websocket: WebSocket;
};

/**
 * Item component for Chat list
 */
export const ChatListComponent = ({
  otherUserId,
  otherUserName,
  otherUserAvatarUrl,
  messages,
  websocket,
}: ChatListComponentProps) => {
  const navigation = useNavigation();
  const latestMessage = messages[messages.length - 1] || {content: ''};
  const date = new Date(latestMessage.timestamp * 1000);

  const handlePress = () => {
    navigation.navigate('ChatRoom', {
      otherUserId,
      otherUserName,
      otherUserAvatarUrl,
      messages,
      websocket,
    });
  };

  return (
    <Pressable style={styles.cchat} onPress={handlePress}>
      <UserAvatar
        style={styles.cavatar}
        bgColor="#fff"
        size={50}
        name={otherUserName}
        src={otherUserAvatarUrl}
      />
      <View style={styles.crightContainer}>
        <View>
          <Text style={styles.cusername}>{otherUserName}</Text>
          <Text style={styles.cmessage}>{latestMessage.content}</Text>
        </View>
        <View>
          <Text style={styles.ctime}>{date.toLocaleTimeString()}</Text>
        </View>
      </View>
    </Pressable>
  );
};
