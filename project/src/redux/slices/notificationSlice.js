import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  status: 'idle',
  error: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotifications(state, action) {
      const items = action.payload.items || action.payload;
      state.notifications = items;
      state.unreadCount = items.filter((n) => !n.read).length;
    },
    markRead(state, action) {
      const n = state.notifications.find((x) => x.id === action.payload);
      if (n) { n.read = true; state.unreadCount = state.notifications.filter((x) => !x.read).length; }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.read = true));
      state.unreadCount = 0;
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      state.unreadCount = state.notifications.filter((n) => !n.read).length;
    },
    setNotificationStatus(state, action) { state.status = action.payload; },
    setNotificationError(state, action) { state.error = action.payload; state.status = 'failed'; },
  },
});

export const {
  setNotifications, markRead, markAllRead, removeNotification,
  setNotificationStatus, setNotificationError,
} = notificationSlice.actions;

export default notificationSlice.reducer;
