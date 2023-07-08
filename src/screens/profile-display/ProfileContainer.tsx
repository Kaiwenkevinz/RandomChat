import React, {useEffect} from 'react';
import {store} from '../../store/store';
import {getProfileAsync, selectUser} from '../../store/userSlice';
import {useAppSelector} from '../../hooks/customReduxHooks';
import {useNavigation} from '@react-navigation/native';
import eventEmitter from '../../services/event-emitter';
import {EVENT_UPDATE_USER_PROFILE} from '../../services/event-emitter/constants';
import {userService} from '../../network/lib/user';
import {showToast, toastType} from '../../utils/toastUtil';
import {removeStorageData} from '../../utils/storageUtil';
import {
  LOCAL_STORAGE_KEY_AUTH,
  LOCAL_STORAGE_KEY_READ_ROOMS,
} from '../../constant';
import {goToLogin} from '../../navigation/NavigationService';
import {LoadingView} from '../../components/LoadingView';
import {WebSocketSingleton} from '../../services/event-emitter/WebSocketSingleton';
import {imageService} from '../../network/lib/imageService';
import ProfileDumb from './ProfileDumb';

const Profile = () => {
  const userStore = useAppSelector(selectUser);
  const {user, status} = userStore;
  const navigation = useNavigation();

  let tags: string[];
  if (user.role) {
    tags = user.role.split(';').filter(v => v !== '');
  } else {
    tags = [];
  }

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
    console.log('new avatar url: ', imageService.getImageUrl(imageUrl));
    const newUser = {
      ...user,
      avatar_url: imageService.getImageUrl(imageUrl),
    };
    userService
      .updateUserProfile(newUser)
      .then(
        () => {
          eventEmitter.emit(EVENT_UPDATE_USER_PROFILE);
          showToast(toastType.SUCCESS, '', 'Update avatar successfully');
        },
        err => {
          showToast(toastType.ERROR, '', err.message);
        },
      )
      .catch(err => {
        console.log('onHandleNewAvatar err: ', err);
      });
  };

  const onLogout = () => {
    removeStorageData(LOCAL_STORAGE_KEY_AUTH);
    removeStorageData(LOCAL_STORAGE_KEY_READ_ROOMS);
    WebSocketSingleton.closeAndReset();
    goToLogin();
  };

  const onEditProfile = () => {
    navigation.navigate('ProfileEdit', {
      ...user,
    });
  };

  return (
    <>
      {status === 'loading' ? (
        <LoadingView />
      ) : (
        <ProfileDumb
          user={user}
          tags={tags}
          onLogout={onLogout}
          onEditProfile={onEditProfile}
          onHandleNewAvatar={onHandleNewAvatar}
        />
      )}
    </>
  );
};

export default Profile;
