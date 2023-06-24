import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {IChatRoom, IMessagePackReceive} from '../types/network/types';
import UserAvatar from 'react-native-user-avatar';
import {useAppSelector} from '../hooks/customReduxHooks';

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

  const unreadRooms = useAppSelector(state => state.chat.unreadRooms);
  const hasUnread = unreadRooms.findIndex(id => id === otherUserId) !== -1;

  const handlePress = () => {
    navigation.navigate('ChatRoom', {
      otherUserId,
      otherUserName,
      otherUserAvatarUrl,
      messages,
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.crightContainer}>
        <UserAvatar
          bgColor="#fff"
          size={50}
          name={otherUserName}
          src={otherUserAvatarUrl}
        />
        <View style={styles.cchatInfo}>
          <Text style={styles.cusername}>{otherUserName}</Text>
          {/* {hasUnread ? (
            <Text style={styles.cusername}>unread</Text>
          ) : (
            <Text style={styles.cusername}>read</Text>
          )} */}
          <Text style={styles.cmessage} numberOfLines={1} ellipsizeMode="tail">
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

const styles = StyleSheet.create({
  crightContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 70,
    marginBottom: 10,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  cchatInfo: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
  },
  cusername: {
    flex: 1,
    fontSize: 18,
    alignItems: 'center',
    fontWeight: 'bold',
  },
  cmessage: {
    flex: 1,
    fontSize: 14,
    opacity: 0.7,
  },
  ctime: {
    marginTop: 10,
    flex: 1,
    fontSize: 12,
    opacity: 0.5,
  },
});
