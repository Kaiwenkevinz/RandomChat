import {Text, View} from 'react-native';
import React, {createContext, useEffect, useState, useRef} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chats from './Chats';
import Profile from './Profile';
import Contacts from './Contacts';
import Search from './Search';
import {loadStorageData} from '../utils/storageUtil';
import {StackActions, useNavigation} from '@react-navigation/native';
import {User} from '../types/network/types';
import {initTokenInceptor} from '../network/axios.config';
import {LOCAL_STORAGE_KEY_AUTH} from '../constant';

type AuthContextType = {
  token: string;
  user: User;
};

const Tab = createBottomTabNavigator();

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);

const Home = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState<boolean>(true);
  // const authRef = useRef<AuthContextType>({token: '11', user: {} as User});
  const authRef = useRef<AuthContextType>({token: '', user: {} as User});

  useEffect(() => {
    console.log('Home screen mounted');

    // get JWT from AsyncStorage
    loadStorageData(LOCAL_STORAGE_KEY_AUTH)
      .then(data => {
        // token not exist, go to login
        if (!data) {
          navigation.dispatch(StackActions.replace('Login'));
        }

        // TODO: validate JWT
        const token = data.token;
        const valid = token !== null;

        // token not valid, go to login
        if (!valid) {
          navigation.dispatch(StackActions.replace('Login'));
        }

        // add token to axios interceptor, so that every request will have token
        initTokenInceptor(token);

        // save token and user to context
        authRef.current = data;

        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

  return (
    <AuthContext.Provider value={authRef.current}>
      {loading ? (
        <View>
          <Text>loading</Text>
        </View>
      ) : (
        <Tab.Navigator>
          <Tab.Screen name="Chats" component={Chats} />
          <Tab.Screen name="Search" component={Search} />
          <Tab.Screen name="Contacts" component={Contacts} />
          <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
      )}
    </AuthContext.Provider>
  );
};

export default Home;
