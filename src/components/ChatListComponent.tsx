import {View, Text, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {styles} from '../utils/styles';
import {IChatRoom, IMessagePackReceive} from '../types/network/types';
import UserAvatar from 'react-native-user-avatar';

type ChatListComponentProps = Pick<
  IChatRoom,
  'otherUserId' | 'otherUserName' | 'otherUserAvatarUrl'
> & {
  messages: IMessagePackReceive[];
};

/**
 * Item component for Chat list
 */
export const ChatListComponent = ({
  otherUserId,
  otherUserName,
  otherUserAvatarUrl,
  messages,
}: ChatListComponentProps) => {
  const navigation = useNavigation();
  const latestMessage = messages[messages.length - 1] || {content: ''};
  const dateStr = new Date(latestMessage.send_time).toLocaleDateString();

  const handlePress = () => {
    navigation.navigate('ChatRoom', {
      otherUserId,
      otherUserName,
      otherUserAvatarUrl,
      messages,
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
          <Text style={styles.cmessage}>
            {latestMessage.message_type === 'text'
              ? latestMessage.content
              : '[image]'}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>{dateStr}</Text>
        </View>
      </View>
    </Pressable>
  );
};
