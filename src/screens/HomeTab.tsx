import {Text, View} from 'react-native';
import React, {createContext, useEffect, useState, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chats from './Chats';
import Profile from './Profile';
import Contacts from './Contacts';
import Search from './Search';
import {loadStorageData} from '../utils/storageUtil';
import {StackActions, useNavigation} from '@react-navigation/native';
import {initTokenInceptor} from '../network/axios.config';
import {LOCAL_STORAGE_KEY_AUTH} from '../constant';
import {RootStackParamList} from '../types/navigation/types';
import {addNewUserInfo} from '../store/userSlice';
import {store} from '../store/store';

const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeTab = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log('Home screen mounted');

    // get JWT from AsyncStorage
    loadStorageData(LOCAL_STORAGE_KEY_AUTH)
      .then(data => {
        // token not exist, go to login
        if (!data) {
          navigation.dispatch(StackActions.replace('Login'));
        }

        const {token, user} = data;

        // TODO: validate JWT
        const valid = token !== null;

        // token not valid, go to login
        if (!valid) {
          navigation.dispatch(StackActions.replace('Login'));
        }

        // add token to axios interceptor, so that every request will have token
        initTokenInceptor(token);

        // add user info to redux store
        store.dispatch(addNewUserInfo(user));

        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <>
      {loading ? (
        <View>
          <Text>loading</Text>
        </View>
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
            name={'Search'}
            options={{title: 'Search'}}
            component={Search}
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
