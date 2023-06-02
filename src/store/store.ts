import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import counterReducer from './counterSlice';
import chatReducer from './chatSlice';

export const store = configureStore({
  // 所有的 reducer 都要在这里注册
  reducer: {
    counter: counterReducer,
    chat: chatReducer,
  },
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
