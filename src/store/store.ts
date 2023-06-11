import {
  configureStore,
  ThunkAction,
  Action,
  getDefaultMiddleware,
} from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import chatReducer from './chatSlice';
import userReducer from './userSlice';

const middlewares = getDefaultMiddleware({
  // https://github.com/reduxjs/redux-toolkit/issues/415
  immutableCheck: false,
});

if (__DEV__) {
  console.log('Redux debugging is turned on.');
  const createDebugger = require('redux-flipper').default;
  middlewares.push(createDebugger());
}

export const store = configureStore({
  // 所有的 reducer 都要在这里注册
  reducer: {
    counter: counterReducer,
    chat: chatReducer,
    user: userReducer,
  },
  middleware: middlewares,
});

// https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
