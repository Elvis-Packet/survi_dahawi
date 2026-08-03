import axiosClient from './axios';
import { MOCK_PLANS } from '@/data/plans';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/plans?ownerId=&status=&week=
export const getPlans = async (params = {}) => {
  // return axiosClient.get('/plans', { params });
  await delay(450);
  let items = [...MOCK_PLANS];
  if (params.ownerId) items = items.filter((p) => p.ownerId === params.ownerId);
  if (params.status) items = items.filter((p) => p.status === params.status);
  return { data: { items, total: items.length, page: 1, pageSize: 20 } };
};

// TODO: GET /api/plans/:id
export const getPlanById = async (id) => {
  // return axiosClient.get(`/plans/${id}`);
  await delay(300);
  return { data: MOCK_PLANS.find((p) => p.id === id) };
};

// TODO: POST /api/plans
export const createPlan = async (data) => {
  // return axiosClient.post('/plans', data);
  await delay(600);
  return { data: { ...data, id: `pln_${Date.now()}`, status: 'draft', createdAt: new Date().toISOString() } };
};

// TODO: PUT /api/plans/:id
export const updatePlan = async (id, data) => {
  // return axiosClient.put(`/plans/${id}`, data);
  await delay(500);
  return { data: { id, ...data, updatedAt: new Date().toISOString() } };
};

// TODO: POST /api/plans/:id/submit
export const submitPlan = async (id) => {
  // return axiosClient.post(`/plans/${id}/submit`);
  await delay(400);
  return { data: { id, status: 'submitted', submittedAt: new Date().toISOString() } };
};

// TODO: POST /api/plans/:id/approve
export const approvePlan = async (id, payload) => {
  // return axiosClient.post(`/plans/${id}/approve`, payload);
  await delay(450);
  return { data: { id, status: 'approved', reviewedAt: new Date().toISOString(), reviewNotes: payload?.notes } };
};

// TODO: POST /api/plans/:id/reject
export const rejectPlan = async (id, payload) => {
  // return axiosClient.post(`/plans/${id}/reject`, payload);
  await delay(450);
  return { data: { id, status: 'rejected', reviewedAt: new Date().toISOString(), reviewNotes: payload?.notes } };
};

// TODO: DELETE /api/plans/:id
export const deletePlan = async (id) => {
  // return axiosClient.delete(`/plans/${id}`);
  await delay(300);
  return { data: { id, deleted: true } };
};
