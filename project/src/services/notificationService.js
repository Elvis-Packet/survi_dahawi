import axiosClient from './axios';
import { MOCK_NOTIFICATIONS } from '@/data/notifications';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/notifications
export const getNotifications = async () => {
  // return axiosClient.get('/notifications');
  await delay(350);
  return { data: { items: MOCK_NOTIFICATIONS } };
};

// TODO: PATCH /api/notifications/:id/read
export const markNotificationRead = async (id) => {
  // return axiosClient.patch(`/notifications/${id}/read`);
  await delay(200);
  return { data: { id, read: true } };
};

// TODO: POST /api/notifications/read-all
export const markAllNotificationsRead = async () => {
  // return axiosClient.post('/notifications/read-all');
  await delay(300);
  return { data: { success: true } };
};

// TODO: DELETE /api/notifications/:id
export const deleteNotification = async (id) => {
  // return axiosClient.delete(`/notifications/${id}`);
  await delay(200);
  return { data: { id, deleted: true } };
};
