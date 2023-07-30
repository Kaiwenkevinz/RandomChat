import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Navigation from './src/navigation';
import {LogBox} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import {isTurnOnMockAPI, mockAPI} from './src/utils/configUtil';

if (isTurnOnMockAPI()) {
  mockAPI();
}

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
