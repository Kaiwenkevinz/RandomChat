import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import FlipperAsyncStorage from 'rn-flipper-async-storage-advanced';
import Navigation from './src/navigation';

// TODO: 只在 development 环境下使用 mock API
// require('./src/network/mocks/mockAPI');

// TODO: Pagination or infinite scroll to prevent loading all messages at once
// TODO: debounce button

function App(): JSX.Element {
  return (
    <Provider store={store}>
      <FlipperAsyncStorage />
      <Navigation />
    </Provider>
  );
}

export default App;
