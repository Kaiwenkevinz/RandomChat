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
import UserInfo from './profile-display/UserInfo';
import {store} from '../store/store';
import {appendNewChatRoom} from '../store/chatSlice';
import {StackActions, useNavigation} from '@react-navigation/native';

type FriendProfileProps = StackScreenProps<RootStackParamList, 'FriendProfile'>;

const FriendProfile = ({route}: FriendProfileProps) => {
  const navigation = useNavigation();
  const user = route.params;
  console.log(user);

  const handlePress = () => {
    const newChatRoom = {
      otherUserId: user.id,
      otherUserName: user.username ? user.username : '',
      otherUserAvatarUrl: user.avatar_url ? user.avatar_url : '',
    };

    store.dispatch(appendNewChatRoom(newChatRoom));

    // 退回到最上层的 Navigator, 然后跳转到 Chats
    navigation.dispatch(StackActions.popToTop());
    navigation.navigate('Chats');
    navigation.navigate('ChatRoom', newChatRoom);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImagePickerAvatar
          pickerDisabled={true}
          avatarUrl={user.avatar_url}
          imageName={`${user.id}_avatar`}
          onConfirm={() => {}}
        />
        <UserInfo user={user} />
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
