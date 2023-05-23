import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from './src/screens/Home';
import Register from './src/screens/Register';
import Login from './src/screens/Login';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Toast from 'react-native-toast-message';

const Stack = createNativeStackNavigator();

// TODO: 只在 development 环境下使用 mock API
require('./src/network/mocks/mockAPI');

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Login" component={Login} />
        </Stack.Navigator>
        <Toast />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
