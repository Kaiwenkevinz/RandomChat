/* eslint-disable react/no-unstable-nested-components */
import React, {useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chats from './Chats';
import Contacts from './Contacts';
import Recommend from './Recommend';
import {RootStackParamList} from '../types/navigation/types';
import Profile from './profile-display/ProfileContainer';
import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeTab = () => {
  useEffect(() => {
    console.log('Home mounted');

    return () => {
      console.log('Home unmounted');
    };
  }, []);
  return (
    <Tab.Navigator
      screenOptions={() => ({
        headerShown: true,
        tabBarInactiveTintColor: 'gray',
      })}>
      <Tab.Screen
        name={'Chats'}
        options={{
          title: 'Chats',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="message1"
              size={20}
              color={focused ? '#007aff' : 'black'}
            />
          ),
        }}
        component={Chats}
      />
      <Tab.Screen
        name={'Recommend'}
        options={{
          title: 'Recommend',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="link"
              size={20}
              color={focused ? '#007aff' : 'black'}
            />
          ),
        }}
        component={Recommend}
      />
      <Tab.Screen
        name={'Contacts'}
        options={{
          title: 'Contact',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="contacts"
              size={20}
              color={focused ? '#007aff' : 'black'}
            />
          ),
        }}
        component={Contacts}
      />
      <Tab.Screen
        name={'Profile'}
        options={{
          title: 'Profile',
          tabBarIcon: ({focused}) => (
            <AntDesign
              name="user"
              size={20}
              color={focused ? '#007aff' : 'black'}
            />
          ),
        }}
        component={Profile}
      />
    </Tab.Navigator>
  );
};

export default HomeTab;
