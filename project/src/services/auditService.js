import axiosClient from './axios';
import { MOCK_AUDIT_LOGS, MOCK_LOGIN_HISTORY } from '@/data/audit';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/audit-logs?action=&severity=&page=
export const getAuditLogs = async (params = {}) => {
  // return axiosClient.get('/audit-logs', { params });
  await delay(450);
  let items = [...MOCK_AUDIT_LOGS];
  if (params.action) items = items.filter((l) => l.action === params.action);
  if (params.severity) items = items.filter((l) => l.severity === params.severity);
  return { data: { items, total: items.length, page: 1, pageSize: 20 } };
};

// TODO: GET /api/audit-logs/:id
export const getAuditLogById = async (id) => {
  // return axiosClient.get(`/audit-logs/${id}`);
  await delay(300);
  return { data: MOCK_AUDIT_LOGS.find((l) => l.id === id) };
};

// TODO: GET /api/audit-logs/login-history?page=
export const getLoginHistory = async (params = {}) => {
  // return axiosClient.get('/audit-logs/login-history', { params });
  await delay(400);
  let items = [...MOCK_LOGIN_HISTORY];
  if (params.status) items = items.filter((l) => l.status === params.status);
  return { data: { items, total: items.length, page: 1, pageSize: 20 } };
};
