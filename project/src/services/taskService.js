import axiosClient from './axios';
import { MOCK_TASKS } from '@/data/tasks';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/tasks?assigneeId=&status=&page=
export const getTasks = async (params = {}) => {
  // return axiosClient.get('/tasks', { params });
  await delay(400);
  let items = [...MOCK_TASKS];
  if (params.assigneeId) items = items.filter((t) => t.assigneeId === params.assigneeId);
  if (params.status) items = items.filter((t) => t.status === params.status);
  return { data: { items, total: items.length, page: 1, pageSize: 20 } };
};

// TODO: GET /api/tasks/:id
export const getTaskById = async (id) => {
  // return axiosClient.get(`/tasks/${id}`);
  await delay(300);
  const task = MOCK_TASKS.find((t) => t.id === id);
  return { data: task };
};

// TODO: POST /api/tasks
export const createTask = async (data) => {
  // return axiosClient.post('/tasks', data);
  await delay(500);
  return { data: { ...data, id: `tsk_${Date.now()}`, status: 'pending', progress: 0, verified: false, createdAt: new Date().toISOString() } };
};

// TODO: PATCH /api/tasks/:id
export const updateTask = async (id, data) => {
  // return axiosClient.patch(`/tasks/${id}`, data);
  await delay(450);
  return { data: { id, ...data } };
};

// TODO: PATCH /api/tasks/:id/progress
export const updateTaskProgress = async (id, progress) => {
  // return axiosClient.patch(`/tasks/${id}/progress`, { progress });
  await delay(350);
  return { data: { id, progress } };
};

// TODO: POST /api/tasks/:id/complete
export const markTaskComplete = async (id) => {
  // return axiosClient.post(`/tasks/${id}/complete`);
  await delay(400);
  return { data: { id, status: 'completed', progress: 100 } };
};

// TODO: POST /api/tasks/:id/verify
export const verifyTask = async (id, payload) => {
  // return axiosClient.post(`/tasks/${id}/verify`, payload);
  await delay(400);
  return { data: { id, status: 'verified', verified: true, reviewNotes: payload?.notes } };
};

// TODO: DELETE /api/tasks/:id
export const deleteTask = async (id) => {
  // return axiosClient.delete(`/tasks/${id}`);
  await delay(300);
  return { data: { id, deleted: true } };
};
