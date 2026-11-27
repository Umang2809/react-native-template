import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/** Example app-wide slice. Replace or remove once the app has real global state. */
interface GlobalState {
  value: number;
}

const initialState: GlobalState = {
  value: 0,
};

const appSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setValue: (state, action: PayloadAction<number>) => {
      state.value = action.payload;
    },
    resetValue: state => {
      state.value = 0;
    },
  },
});

export const { setValue, resetValue } = appSlice.actions;
export default appSlice.reducer;
