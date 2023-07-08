import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation/types';
import {ImagePickerAvatar} from './profile-display/ImagePickerAvatar';
import UserInfo from '../components/UserInfo/UserInfo';
import {store} from '../store/store';
import {appendNewChatRoom} from '../store/chatSlice';
import {StackActions, useNavigation} from '@react-navigation/native';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {generateSendMessagePack} from './chat-room/chatUtil';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/userSlice';

type FriendProfileProps = StackScreenProps<RootStackParamList, 'FriendProfile'>;

const FriendProfile = ({route}: FriendProfileProps) => {
  const navigation = useNavigation();
  const friend = route.params;

  const user = useAppSelector(selectUser).user;

  const handlePress = async () => {
    const newChatRoom = {
      otherUserId: friend.id,
      otherUserName: friend.username ? friend.username : '',
      otherUserAvatarUrl: friend.avatar_url ? friend.avatar_url : '',
    };

    store.dispatch(appendNewChatRoom(newChatRoom));

    const msgObj = generateSendMessagePack(
      '',
      user.id,
      '',
      user.username || '',
      friend.id,
      'system',
    );
    console.log('WebSocket send: ', msgObj);
    WebSocketSingleton.getWebsocket()?.send(JSON.stringify(msgObj));

    navigation.navigate('Chats');
    navigation.navigate('ChatRoom', newChatRoom);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImagePickerAvatar
          pickerDisabled={true}
          avatarUrl={friend.avatar_url}
          imageName={`${friend.id}_avatar`}
          onConfirm={() => {}}
        />
        <UserInfo user={friend} />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // paddingTop: 10,
    padding: 10,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default FriendProfile;
