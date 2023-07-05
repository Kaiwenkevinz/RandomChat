import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Chats from './Chats';
import Profile from './profile-display/Profile';
import Contacts from './Contacts';
import Recommend from './Recommend';
import {RootStackParamList} from '../types/navigation/types';

const Tab = createBottomTabNavigator<RootStackParamList>();

const HomeTab = () => {
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
