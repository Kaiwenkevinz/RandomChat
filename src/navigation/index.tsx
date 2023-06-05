import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatRoom from '../screens/ChatRoom';
import {RootStackParamList} from '../types/navigation/types';
import Register from '../screens/Register';
import Login from '../screens/Login';
import Toast from 'react-native-toast-message';
import HomeTab from '../screens/HomeTab';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: true}}
        initialRouteName={'HomeTab'}>
        <Stack.Screen name={'Register'} component={Register} />
        <Stack.Screen name={'Login'} component={Login} />
        <Stack.Screen name={'HomeTab'} component={HomeTab} />
        <Stack.Screen name={'ChatRoom'} component={ChatRoom} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
};

export default Navigation;
