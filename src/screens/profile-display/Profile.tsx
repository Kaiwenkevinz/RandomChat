import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {store} from '../../store/store';
import {getProfileAsync, selectUser} from '../../store/userSlice';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import eventEmitter from '../../services/event-emitter';
import {EVENT_UPDATE_USER_PROFILE} from '../../services/event-emitter/constants';
import {userService} from '../../network/lib/user';
import {showToast, toastType} from '../../utils/toastUtil';
import {ImagePickerAvatar} from './ImagePickerAvatar';

const Profile = () => {
  const userStore = useAppSelector(selectUser);
  const {user, status} = userStore;
  const navigation = useNavigation();

  useEffect(() => {
    store.dispatch(getProfileAsync());
    eventEmitter.on(EVENT_UPDATE_USER_PROFILE, () => {
      store.dispatch(getProfileAsync());
    });

    return () => {
      eventEmitter.off(EVENT_UPDATE_USER_PROFILE, () => {
        console.log('Event listener', EVENT_UPDATE_USER_PROFILE, 'removed');
      });
    };
  }, []);

  const onHandleNewAvatar = (imageUrl: string) => {
    console.log('new avatar url: ', imageUrl);
    user.avatar_url = imageUrl;
    userService.updateUserProfile(user).then(
      () => {
        eventEmitter.emit(EVENT_UPDATE_USER_PROFILE);
        showToast(toastType.SUCCESS, '', 'Update avatar successfully');
      },
      err => {
        showToast(toastType.ERROR, '', err.message);
      },
    );
  };

  return (
    <>
      {status === 'loading' ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.infoContainer}>
            <ImagePickerAvatar
              avatarUrl={user.avatar_url}
              imageName={`${user.id}_avatar`}
              onConfirm={onHandleNewAvatar}
            />
            <Text style={styles.label}>Id:</Text>
            <Text style={styles.value}>{user.id}</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{user.username}</Text>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{user.gender}</Text>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{user.age}</Text>
            <Text style={styles.label}>Hometown:</Text>
            <Text style={styles.value}>{user.hometown}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user.mail}</Text>
            <Text style={styles.label}>Major:</Text>
            <Text style={styles.value}>{user.major}</Text>
            <Text style={styles.label}>Birthday:</Text>
            <Text style={styles.value}>{user.birthday}</Text>
            <Text style={styles.label}>School:</Text>
            <Text style={styles.value}>{user.school}</Text>
            <Text style={styles.label}>MBTI:</Text>
            <Text style={styles.value}>{user.mbti}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate('ProfileEdit', {
                ...user,
              });
            }}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  infoContainer: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    marginBottom: 16,
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

export default Profile;
