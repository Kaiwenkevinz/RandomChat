import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Modal,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {RootStackParamList} from '../types/navigation/types';
import {ImagePickerAvatar} from './profile-display/ImagePickerAvatar';
import UserInfo from '../components/UserInfo/UserInfo';
import {store} from '../store/store';
import {appendNewChatRoom} from '../store/chat/chatSlice';
import {useNavigation} from '@react-navigation/native';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {generateSendMessagePack} from './chat-room/chatUtil';
import {useAppSelector} from '../hooks/customReduxHooks';
import {selectUser} from '../store/user/userSlice';
import {userService} from '../network/lib/user';
import ImageViewer from 'react-native-image-zoom-viewer';

type FriendProfileProps = StackScreenProps<RootStackParamList, 'FriendProfile'>;

const FriendProfile = ({route}: FriendProfileProps) => {
  const navigation = useNavigation();
  const friend = route.params;

  const [photoWallUrls, setPhotoWallUrls] = useState<string[]>([]);
  const [loadingPhotoWall, setLoadingPhotoWall] = useState(true);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const imageViewIndexRef = useRef(0);

  let tags: string[];
  if (friend.role) {
    tags = friend.role.split(';').filter(v => v !== '');
  } else {
    tags = [];
  }

  const user = useAppSelector(selectUser).user;

  const token = useAppSelector(state => state.user.token);
  const fetchPhotoWall = async (id: number) => {
    setLoadingPhotoWall(true);
    try {
      const res = await userService.getPhotoWall(id);
      setPhotoWallUrls(res.data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingPhotoWall(false);
    }
  };

  useEffect(() => {
    fetchPhotoWall(friend.id);
  }, []);

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

        <UserInfo
          username={friend.username}
          tags={tags}
          age={friend.age}
          birthday={friend.birthday}
          gender={friend.gender}
          hometown={friend.hometown}
          email={friend.mail}
          major={friend.mail}
          mbti={friend.mbti}
          telephoneNumber={friend.telephone_number}
        />

        {/* 照片墙 title */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 10,
              marginHorizontal: 10,
            }}>
            Photo Wall
          </Text>
        </View>

        {/* 照片墙照片 */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}>
          {loadingPhotoWall ? (
            <ActivityIndicator size="small" />
          ) : (
            <FlatList
              data={photoWallUrls}
              horizontal={true}
              renderItem={({item, index}) => (
                <View style={{position: 'relative'}}>
                  <Pressable
                    key={index}
                    onPress={() => {
                      setImageViewVisible(true);
                      imageViewIndexRef.current = index;
                    }}>
                    <Image
                      source={{uri: item}}
                      style={{width: 150, height: 200, marginHorizontal: 10}}
                      resizeMode="cover"
                    />
                  </Pressable>
                </View>
              )}
              keyExtractor={item => item}
            />
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <Text style={styles.buttonText}>Start Chatting</Text>
        </TouchableOpacity>

        <Modal visible={imageViewVisible} transparent={true}>
          <ImageViewer
            index={imageViewIndexRef.current}
            onClick={() => setImageViewVisible(false)}
            imageUrls={photoWallUrls.map(url => {
              return {
                url,
                width: 300,
                height: 500,
                freeHeight: true,
                props: {
                  source: {
                    headers: {
                      Authorization: `Bearer ${token}`,
                    },
                  },
                },
              };
            })}
          />
        </Modal>
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
