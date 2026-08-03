import { createSlice } from '@reduxjs/toolkit';

const token = localStorage.getItem('survitec_token');
const storedUser = localStorage.getItem('survitec_user');

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: token || null,
  isAuthenticated: Boolean(token),
  status: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action) {
      const { token: tok, user } = action.payload;
      state.user = user;
      state.token = tok;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem('survitec_token', tok);
      localStorage.setItem('survitec_user', JSON.stringify(user));
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('survitec_token');
      localStorage.removeItem('survitec_user');
    },
    updateCurrentUser(state, action) {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('survitec_user', JSON.stringify(state.user));
    },
    setAuthStatus(state, action) {
      state.status = action.payload;
    },
    setAuthError(state, action) {
      state.error = action.payload;
      state.status = 'failed';
    },
  },
});

export const { setCredentials, logout, updateCurrentUser, setAuthStatus, setAuthError } =
  authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectCurrentRole = (state) => state.auth.user?.role;

export default authSlice.reducer;
