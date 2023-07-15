import {View, Text, Pressable, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {IChatRoom, IMessagePackReceive} from '../types/network/types';
import {useAppSelector} from '../hooks/customReduxHooks';
import CircleImage from './CircleImage';
import ScoreTag from './ScoreTag';

const generateContentPreview = (message: IMessagePackReceive) => {
  switch (message.message_type) {
    case 'text':
      return message.content;
    case 'image':
      return '[Image]';
    default:
      return '';
  }
};

type ChatListComponentProps = IChatRoom;

/**
 * Item component for Chat list
 */
export const ChatListComponent = ({
  otherUserId,
  otherUserName,
  otherUserAvatarUrl,
  messages,
  total,
}: ChatListComponentProps) => {
  const navigation = useNavigation();

  const scoreThreshold = useAppSelector(state => state.user.scoreThreshold);
  const scoreMemo = useAppSelector(state => state.user.scoreMemo);
  const score = scoreMemo[otherUserId] || 0;

  const latestMessage = messages[messages.length - 1] || {content: ''};
  let dateStr = '';
  if (messages.length > 0) {
    dateStr = new Date(latestMessage.send_time).toLocaleDateString();
  }

  const readRooms = useAppSelector(state => state.chat.readRooms);
  const isRead =
    readRooms.findIndex(room => room.roomId === otherUserId) !== -1;

  const contentPreview = generateContentPreview(latestMessage);

  const handlePress = () => {
    navigation.navigate('ChatRoom', {
      otherUserId,
      otherUserName,
      otherUserAvatarUrl,
      total,
    });
  };

  return (
    <Pressable onPress={handlePress}>
      <View style={styles.crightContainer}>
        <CircleImage
          size={50}
          avatarUrl={otherUserAvatarUrl}
          borderColor="#fff"
        />
        <View style={styles.cchatInfo}>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.cusername} numberOfLines={1}>
              {otherUserName}
            </Text>
            <ScoreTag score={score} threshold={scoreThreshold} />
          </View>
          <Text
            style={[
              !isRead ? {color: '#509AD6', fontWeight: 'bold'} : {opacity: 0.7},
              styles.cmessage,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {contentPreview}
          </Text>
        </View>
        <View>
          <Text style={styles.ctime}>{dateStr}</Text>
          {!isRead && (
            <View style={styles.unreadIconContainer}>
              <View style={styles.smallBlueDot} />
            </View>
          )}
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
  unreadIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  smallBlueDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: '#509AD6',
  },
  cusername: {
    flex: 1,
    fontSize: 16,
    alignItems: 'center',
  },
  cmessage: {
    marginTop: 5,
    flex: 1,
    fontSize: 14,
  },
  ctime: {
    marginTop: 10,
    flex: 1,
    fontSize: 12,
    opacity: 0.5,
    marginLeft: 2,
  },
});
