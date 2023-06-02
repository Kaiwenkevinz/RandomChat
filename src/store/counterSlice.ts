import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from './store';
import {fetchCount} from '../network/counterAPI';

/**
 * slice 是一个 reducer 的集合，它可以包含多个 reducer 函数 + action creator
 */

interface CounterState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterState = {
  value: 0,
  status: 'idle',
};

// createAsyncThunk 用于创建异步 action creator
export const incrementAsync = createAsyncThunk<
  number,
  number,
  {state: {counter: CounterState}}
>('counter/fetchCount', async (amount: number, {getState}) => {
  const {value} = getState().counter;
  const response = await fetchCount(value, amount);
  return response.data;
});

// slice 是 reducers 和 action creator 的集合
export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: state => {
      state.value += 1;
    },
    decrement: state => {
      state.value -= 1;
    },
    // Use the PayloadAction type to declare the contents of `action.payload`
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(incrementAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value = action.payload;
      });
  },
});

export const {increment, decrement, incrementByAmount} = counterSlice.actions;

//  useSelector(selectCount)
// selector回调函数，提供 state，选择需要的值
export const selectCount = (state: RootState) => state.counter.value;

export default counterSlice.reducer;
