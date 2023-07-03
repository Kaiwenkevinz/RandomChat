import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chats from './Chats';
import Profile from './profile-display/Profile';
import Contacts from './Contacts';
import Recommend from './Recommend';
import {loadStorageData, saveStorageData} from '../utils/storageUtil';
import {StackActions, useNavigation} from '@react-navigation/native';
import {
  LOCAL_STORAGE_KEY_AUTH,
  LOCAL_STORAGE_KEY_SCORE_THRESHOLD,
} from '../constant';
import {RootStackParamList} from '../types/navigation/types';
import {addNewUserInfo, addToken} from '../store/userSlice';
import {store} from '../store/store';
import {initAuthInceptor} from '../network/axios.config';
import {ILoginResponse, IUser} from '../types/network/types';
import {userService} from '../network/lib/user';
import {LoadingView} from '../components/LoadingView';

const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeTab = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);

  const handleTokenAndUserInfo = (storageData: ILoginResponse) => {
    let token = storageData?.token;
    let user = storageData?.user;
    let userId = user?.id;

    // TODO: validate JWT
    const valid = token !== null;

    // token not valid, go to login
    if (!valid) {
      navigation.dispatch(StackActions.replace('Login'));

      return;
    }

    // add token to axios interceptor, so that every request will have token
    if (!token) {
      token = '';
    }
    if (!userId) {
      userId = 0;
    }
    initAuthInceptor(token, userId);

    // add user info to redux store
    store.dispatch(addNewUserInfo(user as IUser));
    store.dispatch(addToken(token));
  };

  const handleScoreThreshold = async (scoreThreshold: number) => {
    await saveStorageData(LOCAL_STORAGE_KEY_SCORE_THRESHOLD, scoreThreshold);
  };

  /**
   * 处理 tokens，配置项
   */
  const prepareConfigs = async () => {
    setLoading(true);

    const loadStoragePromise = loadStorageData<ILoginResponse>(
      LOCAL_STORAGE_KEY_AUTH,
    );
    const getScoreThresholdPromise = userService.getScoreThreshold();

    try {
      const [storageData, scoreThresholdResult] = await Promise.all([
        loadStoragePromise,
        getScoreThresholdPromise,
      ]);
      if (!storageData || !scoreThresholdResult) {
        console.warn('storageData or scoreThreshold is null');
        navigation.dispatch(StackActions.replace('Login'));

        return;
      }
      handleScoreThreshold(scoreThresholdResult.data);
      handleTokenAndUserInfo(storageData);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('Home screen mounted');
    prepareConfigs();

    return () => {
      console.log('Home screen unmounted');
    };
  }, []);

  return (
    <>
      {loading ? (
        <LoadingView />
      ) : (
        <Tab.Navigator
          screenOptions={() => ({
            headerShown: true,
            tabBarInactiveTintColor: 'gray',
          })}>
          <Tab.Screen
            name={'Chats'}
            options={{title: 'Chats'}}
            component={Chats}
          />
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
      )}
    </>
  );
};

export default HomeTab;
