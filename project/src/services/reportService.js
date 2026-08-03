import axiosClient from './axios';
import { MOCK_REPORTS, PERFORMANCE_TRENDS, DEPARTMENT_PERFORMANCE, ORG_KPIS } from '@/data/reports';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/reports?type=&period=
export const getReports = async (params = {}) => {
  // return axiosClient.get('/reports', { params });
  await delay(400);
  let items = [...MOCK_REPORTS];
  if (params.type) items = items.filter((r) => r.type === params.type);
  return { data: { items, total: items.length } };
};

// TODO: GET /api/reports/:id
export const getReportById = async (id) => {
  // return axiosClient.get(`/reports/${id}`);
  await delay(300);
  return { data: MOCK_REPORTS.find((r) => r.id === id) };
};

// TODO: POST /api/reports/generate
export const generateReport = async (data) => {
  // return axiosClient.post('/reports/generate', data);
  await delay(800);
  return { data: { ...data, id: `rpt_${Date.now()}`, generatedAt: new Date().toISOString(), status: 'published', format: 'PDF', size: '1.5 MB' } };
};

// TODO: GET /api/reports/performance-trends
export const getPerformanceTrends = async (range = 'weekly') => {
  // return axiosClient.get('/reports/performance-trends', { params: { range } });
  await delay(300);
  return { data: PERFORMANCE_TRENDS[range] || PERFORMANCE_TRENDS.weekly };
};

// TODO: GET /api/reports/department-performance
export const getDepartmentPerformanceReport = async () => {
  // return axiosClient.get('/reports/department-performance');
  await delay(300);
  return { data: DEPARTMENT_PERFORMANCE };
};

// TODO: GET /api/reports/org-kpis
export const getOrgKpis = async () => {
  // return axiosClient.get('/reports/org-kpis');
  await delay(300);
  return { data: ORG_KPIS };
};
