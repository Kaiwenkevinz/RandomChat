import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Alert,
  Image,
  Modal,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {ImagePickerAvatar} from './ImagePickerAvatar';
import UserInfo from '../../components/UserInfo/UserInfo';
import {IUser} from '../../types/network/types';
import {userService} from '../../network/lib/user';
import {ImageUtil} from '../../utils/imageUtil';
import {imageService} from '../../network/lib/imageService';
import {showToast, toastType} from '../../utils/toastUtil';
import ImageViewer from 'react-native-image-zoom-viewer';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {Pressable} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

type Props = {
  user: IUser;
  tags: string[];
  onHandleNewAvatar: (imageUrl: string) => void;
  onLogout: () => void;
  onEditProfile: () => void;
};

const ProfileDumb = ({
  user,
  tags,
  onHandleNewAvatar,
  onLogout,
  onEditProfile,
}: Props) => {
  const [photoWallUrls, setPhotoWallUrls] = useState<string[]>([]);
  const [loadingPhotoWall, setLoadingPhotoWall] = useState(true);
  const [imageViewVisible, setImageViewVisible] = useState(false);
  const imageViewIndexRef = useRef(0);

  const token = useAppSelector(state => state.user.token);

  const fetchPhotoWall = async () => {
    setLoadingPhotoWall(true);
    try {
      const res = await userService.getPhotoWall(user.id);
      setPhotoWallUrls(res.data);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoadingPhotoWall(false);
    }
  };

  const createTwoButtonAlert = (
    title: string,
    message: string,
    onHandleOk: () => void,
  ) => {
    Alert.alert(title, message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'Confirm', onPress: onHandleOk},
    ]);
  };

  const handleOnPressDeletePhotoWall = (index: number) => {
    createTwoButtonAlert(
      'Delete',
      'Are you sure to delete this photo?',
      async () => {
        setLoadingPhotoWall(true);
        await userService.deletePhotoWall(photoWallUrls[index]).catch(err => {
          console.warn(err);
          setLoadingPhotoWall(false);
        });
        fetchPhotoWall();
      },
    );
  };

  const onPressUpload = async () => {
    if (photoWallUrls.length >= 3) {
      showToast(toastType.INFO, 'Can not upload', 'Photo wall is full');
      return;
    }

    const uri = await ImageUtil.openSingleImageLibrary();
    if (!uri) {
      return;
    }

    // 上传照片 blob
    const filename = `${user.id}_${Date.now()}.jpg`;
    const resp = await imageService.uploadImage(uri, filename, 'photoWall');

    console.log('fetch photo wall');
    fetchPhotoWall();
  };

  useEffect(() => {
    fetchPhotoWall();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={[styles.button, {marginLeft: 10}]}
            onPress={onEditProfile}>
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, {marginRight: 10}]}
            onPress={onLogout}>
            <Text style={styles.buttonText}>Log Out</Text>
          </TouchableOpacity>
        </View>

        <ImagePickerAvatar
          pickerDisabled={false}
          avatarUrl={user.avatar_url}
          imageName={`${user.id}_avatar`}
          onConfirm={onHandleNewAvatar}
        />

        <UserInfo
          username={user.username}
          tags={tags}
          age={user.age}
          birthday={user.birthday}
          gender={user.gender}
          hometown={user.hometown}
          email={user.mail}
          major={user.mail}
          mbti={user.mbti}
          telephoneNumber={user.telephone_number}
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
          {!loadingPhotoWall && (
            <TouchableOpacity
              style={[styles.button, {marginBottom: 10}]}
              onPress={onPressUpload}>
              <Text style={styles.buttonText}>upload</Text>
            </TouchableOpacity>
          )}
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
                      source={{
                        uri: item,
                        headers: {
                          Authorization: `Bearer ${token}}`,
                        },
                      }}
                      style={{width: 150, height: 200, marginHorizontal: 10}}
                      resizeMode="cover"
                    />
                  </Pressable>

                  {/* 删除照片按钮 */}
                  <AntDesign
                    onPress={() => {
                      handleOnPressDeletePhotoWall(index);
                    }}
                    name="minussquare"
                    color={'white'}
                    size={25}
                    style={{position: 'absolute', right: 10, bottom: 0}}
                  />
                </View>
              )}
              keyExtractor={item => item}
            />
          )}
        </View>

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
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#007aff',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProfileDumb;
