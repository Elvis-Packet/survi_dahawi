import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  selectedUser: null,
  total: 0,
  status: 'idle',
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action) {
      state.users = action.payload.items || action.payload;
      state.total = action.payload.total || state.users.length;
    },
    setSelectedUser(state, action) { state.selectedUser = action.payload; },
    addUser(state, action) { state.users.unshift(action.payload); },
    updateUserInList(state, action) {
      const idx = state.users.findIndex((u) => u.id === action.payload.id);
      if (idx !== -1) state.users[idx] = { ...state.users[idx], ...action.payload };
    },
    removeUser(state, action) {
      state.users = state.users.filter((u) => u.id !== action.payload);
    },
    setUserStatus(state, action) { state.status = action.payload; },
    setUserError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setUsers, setSelectedUser, addUser, updateUserInList, removeUser,
  setUserStatus, setUserError,
} = userSlice.actions;

export default userSlice.reducer;
