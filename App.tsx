import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import Navigation from './src/navigation';
import {CONFIG} from './src/config';

const isDev = process.env.NODE_ENV === 'development';
const isMock = CONFIG.TURN_ON_MOCK_API === '1';
if (isDev && isMock) {
  // require('./src/network/mocks/mockAPI');
}
require('./src/network/mocks/mockAPI');

// TODO: Pagination or infinite scroll to prevent loading all messages at once
// TODO: debounce button

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
}

export default App;
