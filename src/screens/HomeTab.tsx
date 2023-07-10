import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chats from './Chats';
import Contacts from './Contacts';
import Recommend from './Recommend';
import {RootStackParamList} from '../types/navigation/types';
import Profile from './profile-display/ProfileContainer';
import {globalLoading} from '../components/GlobalLoading';
import {LOCAL_STORAGE_KEY_AUTH} from '../constant';
import {initAuthInceptor} from '../network/axios.config';
import {WebSocketSingleton} from '../services/event-emitter/WebSocketSingleton';
import {operateReadRoomAsync} from '../store/chatSlice';
import {store} from '../store/store';
import {
  addNewUserInfo,
  addToken,
  getScoreThresholdAsync,
  getScoreMemoAsync,
  getProfileAsync,
} from '../store/userSlice';
import {ILoginResponse, IUser} from '../types/network/types';
import {loadStorageData} from '../utils/storageUtil';

const Tab = createBottomTabNavigator<RootStackParamList>();

const prepareToken = async () => {
  const data = await loadStorageData<ILoginResponse>(LOCAL_STORAGE_KEY_AUTH);

  if (!data || !data.user?.id || !data.token) {
    const errMsg = 'prepareToken: data or user id or token is null!';
    console.warn(errMsg);
    return Promise.reject(errMsg);
  }

  const token = data.token;

  initAuthInceptor(token, data.user.id);

  store.dispatch(addNewUserInfo(data.user as IUser));
  store.dispatch(addToken(token));
};

const HomeTab = () => {
  useEffect(() => {
    console.log('Home mounted');
    globalLoading.show();
    prepareToken()
      .then(async () => {
        await Promise.all([
          store.dispatch(operateReadRoomAsync({option: 'read', newData: null})),
          store.dispatch(getScoreThresholdAsync()),
          store.dispatch(getScoreMemoAsync()),
          store.dispatch(getProfileAsync()),
        ]);

        return Promise.resolve();
      })
      .finally(() => {
        globalLoading.hide();
      });

    return () => {
      console.log('Home unmounted');
      WebSocketSingleton.closeAndReset();
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: true,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen name={'Chats'} options={{title: 'Chats'}} component={Chats} />
      <Tab.Screen
        name={'Recommend'}
        options={{title: 'Recommend'}}
        component={Recommend}
      />
      <Tab.Screen
        name={'Contacts'}
        options={{title: 'Contact'}}
        component={Contacts}
      />
      <Tab.Screen
        name={'Profile'}
        options={{title: 'Profile'}}
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export default HomeTab;
