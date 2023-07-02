import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ChatRoom from '../screens/chat-room/ChatRoom';
import {RootStackParamList} from '../types/navigation/types';
import Register from '../screens/Register';
import Login from '../screens/Login';
import Toast from 'react-native-toast-message';
import HomeTab from '../screens/HomeTab';
import ProfileEdit from '../screens/profile-edit/ProfileEdit';
import FriendProfile from '../screens/FriendProfile';
import VerifyEmail from '../screens/VerifyEmail';
import ForgetPassword from '../screens/ForgetPassword';
import NavigationService from './NavigationService';
import GlobalLoading, {globalLoadingRef} from '../components/GlobalLoading';

const Stack = createStackNavigator<RootStackParamList>();

const Navigation = () => {
  return (
    <NavigationContainer
      ref={(navigatorRef: any) => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'HomeTab'}>
        <Stack.Screen
          name={'Register'}
          options={{headerShown: true, headerTitle: 'Sign Up'}}
          component={Register}
        />
        <Stack.Screen
          name={'VerifyEmail'}
          options={{headerTitle: 'Verify Email'}}
          component={VerifyEmail}
        />
        <Stack.Screen
          name={'Login'}
          options={{headerTitle: 'Login'}}
          component={Login}
        />
        <Stack.Screen
          name={'ForgetPassword'}
          options={{headerShown: true, headerTitle: 'Forget Password'}}
          component={ForgetPassword}
        />
        <Stack.Screen name={'HomeTab'} component={HomeTab} />
        <Stack.Screen
          name={'ChatRoom'}
          options={{headerShown: true, headerBackTitle: 'Chats'}}
          component={ChatRoom}
        />
        <Stack.Screen
          name={'ProfileEdit'}
          options={{headerShown: true, headerBackTitle: 'Profile'}}
          component={ProfileEdit}
        />
        <Stack.Screen
          name={'FriendProfile'}
          options={{headerShown: true, headerBackTitle: 'Contacts'}}
          component={FriendProfile}
        />
      </Stack.Navigator>
      <Toast />
      <GlobalLoading ref={globalLoadingRef} />
    </NavigationContainer>
  );
};

export default Navigation;
