import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Register from './src/screens/Register';
import Login from './src/screens/Login';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Toast from 'react-native-toast-message';
import Home from './src/screens/Home';
import ChatRoom from './src/screens/ChatRoom';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';

// TODO: 只在 development 环境下使用 mock API
require('./src/network/mocks/mockAPI');

const Stack = createNativeStackNavigator();

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <FlipperAsyncStorage />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen name="ChatRoom" component={ChatRoom} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
