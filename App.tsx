import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Navigation from './src/navigation';
import {CONFIG} from './src/config';
import {LogBox} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';

const isDev = process.env.NODE_ENV === 'development';
const isMock = CONFIG.TURN_ON_MOCK_API === '1';
if (isDev && isMock) {
  // require('./src/network/mocks/mockAPI');
}
require('./src/network/mocks/mockAPI');
LogBox.ignoreAllLogs(); //Ignore all log notifications

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <MenuProvider>
        <Navigation />
      </MenuProvider>
    </Provider>
  );
}

export default App;
