import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type User = { [key: string]: any } | null;

interface AuthState {
  user: User;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    setUser(state, action: PayloadAction<User>) {
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

export const { setCredentials, setUser, setAccessToken, clearAuth } =
  authSlice.actions;

export const selectCurrentUser = (state: any) => state.auth?.user;
export const selectAccessToken = (state: any) => state.auth?.accessToken;

export default authSlice.reducer;
