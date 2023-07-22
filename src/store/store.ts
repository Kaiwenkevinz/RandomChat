import {
  configureStore,
  ThunkAction,
  Action,
  combineReducers,
  AnyAction,
  Reducer,
  CombinedState,
} from '@reduxjs/toolkit';
import chatReducer from './chat/chatSlice';
import userReducer from './user/userSlice';

const rootReducer: Reducer = (state: RootState, action: AnyAction) => {
  if (action.type === 'reset') {
    state = {} as RootState;
  }
  return combinedReducer(state, action);
};

const combinedReducer = combineReducers({
  chat: chatReducer,
  user: userReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type RootState = CombinedState<ReturnType<typeof combinedReducer>>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
