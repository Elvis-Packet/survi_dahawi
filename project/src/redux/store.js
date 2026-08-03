import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import dashboardReducer from './slices/dashboardSlice';
import userReducer from './slices/userSlice';
import taskReducer from './slices/taskSlice';
import planReducer from './slices/planSlice';
import notificationReducer from './slices/notificationSlice';
import departmentReducer from './slices/departmentSlice';
import reportReducer from './slices/reportSlice';
import auditReducer from './slices/auditSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    user: userReducer,
    task: taskReducer,
    plan: planReducer,
    notification: notificationReducer,
    department: departmentReducer,
    report: reportReducer,
    audit: auditReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
