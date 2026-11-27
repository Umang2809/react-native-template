import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../types';
import type { RootStore } from '../store';

interface AuthState {
  user: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, setUser, setAccessToken, clearAuth } = authSlice.actions;

export const selectCurrentUser = (state: RootStore) => state.auth.user;
export const selectAccessToken = (state: RootStore) => state.auth.accessToken;
export const selectIsLoggedIn = (state: RootStore) => !!state.auth.accessToken;

export default authSlice.reducer;
