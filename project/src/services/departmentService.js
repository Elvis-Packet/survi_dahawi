import axiosClient from './axios';
import { MOCK_DEPARTMENTS } from '@/data/departments';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/departments
export const getDepartments = async () => {
  // return axiosClient.get('/departments');
  await delay(400);
  return { data: { items: MOCK_DEPARTMENTS } };
};

// TODO: GET /api/departments/:id
export const getDepartmentById = async (id) => {
  // return axiosClient.get(`/departments/${id}`);
  await delay(300);
  return { data: MOCK_DEPARTMENTS.find((d) => d.id === id) };
};

// TODO: POST /api/departments
export const createDepartment = async (data) => {
  // return axiosClient.post('/departments', data);
  await delay(500);
  return { data: { ...data, id: `dep_${Date.now()}`, memberCount: 0, status: 'active' } };
};

// TODO: PATCH /api/departments/:id
export const updateDepartment = async (id, data) => {
  // return axiosClient.patch(`/departments/${id}`, data);
  await delay(450);
  return { data: { id, ...data } };
};

// TODO: DELETE /api/departments/:id
export const deleteDepartment = async (id) => {
  // return axiosClient.delete(`/departments/${id}`);
  await delay(300);
  return { data: { id, deleted: true } };
};
