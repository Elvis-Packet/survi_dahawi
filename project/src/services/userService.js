import axiosClient from './axios';
import { MOCK_USERS } from '@/data/users';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/users?role=&department=&status=&page=
export const getUsers = async (params = {}) => {
  // return axiosClient.get('/users', { params });
  await delay(450);
  let items = [...MOCK_USERS];
  if (params.role) items = items.filter((u) => u.role === params.role);
  if (params.department) items = items.filter((u) => u.department === params.department);
  if (params.status) items = items.filter((u) => u.status === params.status);
  if (params.search) {
    const q = params.search.toLowerCase();
    items = items.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }
  return { data: { items, total: items.length, page: 1, pageSize: 20 } };
};

// TODO: GET /api/users/:id
export const getUserById = async (id) => {
  // return axiosClient.get(`/users/${id}`);
  await delay(300);
  return { data: MOCK_USERS.find((u) => u.id === id) };
};

// TODO: POST /api/users
export const createUser = async (data) => {
  // return axiosClient.post('/users', data);
  await delay(600);
  return { data: { ...data, id: `usr_${Date.now()}`, status: 'active', joinedAt: new Date().toISOString() } };
};

// TODO: PATCH /api/users/:id
export const updateUser = async (id, data) => {
  // return axiosClient.patch(`/users/${id}`, data);
  await delay(500);
  return { data: { id, ...data } };
};

// TODO: POST /api/users/:id/suspend
export const suspendUser = async (id) => {
  // return axiosClient.post(`/users/${id}/suspend`);
  await delay(400);
  return { data: { id, status: 'suspended' } };
};

// TODO: POST /api/users/:id/activate
export const activateUser = async (id) => {
  // return axiosClient.post(`/users/${id}/activate`);
  await delay(400);
  return { data: { id, status: 'active' } };
};

// TODO: DELETE /api/users/:id
export const deleteUser = async (id) => {
  // return axiosClient.delete(`/users/${id}`);
  await delay(400);
  return { data: { id, deleted: true } };
};

// TODO: PATCH /api/users/profile
export const updateProfile = async (data) => {
  // return axiosClient.patch('/users/profile', data);
  await delay(500);
  return { data: { ...data, updatedAt: new Date().toISOString() } };
};
