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
  if (params.department) items = items.filter((p) => p.department === params.department);
  if (params.weekStart) items = items.filter((p) => p.weekStart >= params.weekStart);
  if (params.weekEnd) items = items.filter((p) => p.weekEnd <= params.weekEnd);
  if (params.week) items = items.filter((p) => p.weekLabel?.toLowerCase().includes(String(params.week).toLowerCase()));
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
  return {
    data: {
      ...data,
      id: `pln_${Date.now()}`,
      status: 'draft',
      comments: data.comments || [],
      createdAt: new Date().toISOString(),
    },
  };
};

// TODO: PUT /api/plans/:id
export const updatePlan = async (id, data) => {
  // return axiosClient.put(`/plans/${id}`, data);
  await delay(500);
  return { data: { id, ...data, comments: data.comments || [], updatedAt: new Date().toISOString() } };
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
  return {
    data: {
      id,
      status: 'approved',
      reviewedAt: new Date().toISOString(),
      reviewNotes: payload?.notes || null,
    },
  };
};

// TODO: POST /api/plans/:id/reject
export const rejectPlan = async (id, payload) => {
  // return axiosClient.post(`/plans/${id}/reject`, payload);
  await delay(450);
  return {
    data: {
      id,
      status: 'rejected',
      reviewedAt: new Date().toISOString(),
      reviewNotes: payload?.notes || null,
    },
  };
};

// TODO: POST /api/plans/:id/comments
export const addPlanComment = async (id, payload) => {
  await delay(350);
  const plan = MOCK_PLANS.find((p) => p.id === id);
  const comment = {
    id: `cmt_${Date.now()}`,
    authorId: payload?.authorId,
    authorName: payload?.authorName,
    role: payload?.role,
    message: payload?.message,
    createdAt: new Date().toISOString(),
  };

  const nextComments = [...(plan?.comments || []), comment];
  return { data: { id, comments: nextComments } };
};

// TODO: DELETE /api/plans/:id
export const deletePlan = async (id) => {
  // return axiosClient.delete(`/plans/${id}`);
  await delay(300);
  return { data: { id, deleted: true } };
};
