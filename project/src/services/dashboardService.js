import axiosClient from './axios';
import { ORG_KPIS, PERFORMANCE_TRENDS, DEPARTMENT_PERFORMANCE } from '@/data/reports';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// TODO: GET /api/dashboard/stats?role=
export const getDashboardStats = async (role) => {
  // return axiosClient.get('/dashboard/stats', { params: { role } });
  await delay(400);
  const base = {
    totalTasks: 24,
    completedTasks: 14,
    pendingTasks: 6,
    overdueTasks: 1,
    avgPerformance: 88,
    weeklyPlanStatus: 'draft',
    teamMembers: 8,
    plansPendingReview: 2,
    tasksPendingVerification: 3,
  };
  return { data: { ...base, ...ORG_KPIS } };
};

// TODO: GET /api/dashboard/performance-trends?range=
export const getPerformanceTrends = async (range = 'weekly') => {
  // return axiosClient.get('/dashboard/performance-trends', { params: { range } });
  await delay(350);
  return { data: PERFORMANCE_TRENDS[range] || PERFORMANCE_TRENDS.weekly };
};

// TODO: GET /api/dashboard/department-performance
export const getDepartmentPerformance = async () => {
  // return axiosClient.get('/dashboard/department-performance');
  await delay(300);
  return { data: DEPARTMENT_PERFORMANCE };
};

// TODO: GET /api/dashboard/recent-activities?limit=
export const getRecentActivities = async (limit = 6) => {
  // return axiosClient.get('/dashboard/recent-activities', { params: { limit } });
  await delay(300);
  return {
    data: [
      { id: 'act_1', type: 'task_completed', text: 'Completed "Onboard 12 new merchant accounts"', actor: 'Alex Morgan', timestamp: '2026-08-02T11:00:00.000Z' },
      { id: 'act_2', type: 'plan_submitted', text: 'Submitted Week 31 plan', actor: 'Priya Sharma', timestamp: '2026-07-26T15:00:00.000Z' },
      { id: 'act_3', type: 'task_assigned', text: 'Assigned "Draft compliance memo" to Alex Morgan', actor: 'Jordan Lee', timestamp: '2026-08-01T09:02:00.000Z' },
      { id: 'act_4', type: 'plan_approved', text: 'Approved Week 31 plan for Alex Morgan', actor: 'Jordan Lee', timestamp: '2026-07-27T09:30:00.000Z' },
      { id: 'act_5', type: 'task_verified', text: 'Verified "Onboard merchant accounts"', actor: 'Maya Patel', timestamp: '2026-08-02T11:00:00.000Z' },
      { id: 'act_6', type: 'plan_rejected', text: 'Rejected Week 30 plan for Elena Rodriguez', actor: 'Jordan Lee', timestamp: '2026-07-19T17:00:00.000Z' },
    ].slice(0, limit),
  };
};

// TODO: GET /api/dashboard/upcoming-tasks?assigneeId=
export const getUpcomingTasks = async () => {
  // return axiosClient.get('/dashboard/upcoming-tasks');
  await delay(300);
  return {
    data: [
      { id: 'ut_1', title: 'Reconcile Q3 payment gateway settlements', dueDate: '2026-08-06T17:00:00.000Z', priority: 'high', status: 'in_progress' },
      { id: 'ut_2', title: 'Draft compliance memo on new NYDFS regulation', dueDate: '2026-08-10T17:00:00.000Z', priority: 'critical', status: 'pending' },
      { id: 'ut_3', title: 'Weekly fraud screening review', dueDate: '2026-08-09T17:00:00.000Z', priority: 'medium', status: 'pending' },
      { id: 'ut_4', title: 'Optimize payment routing logic', dueDate: '2026-08-20T17:00:00.000Z', priority: 'low', status: 'in_progress' },
    ],
  };
};

// TODO: GET /api/dashboard/employee-rankings
export const getEmployeeRankings = async () => {
  // return axiosClient.get('/dashboard/employee-rankings');
  await delay(300);
  return {
    data: [
      { id: 'r1', name: 'Elena Rodriguez', department: 'Finance', score: 93, tasksCompleted: 22 },
      { id: 'r2', name: 'Priya Sharma', department: 'Compliance', score: 91, tasksCompleted: 19 },
      { id: 'r3', name: 'Aisha Khan', department: 'Operations', score: 90, tasksCompleted: 17 },
      { id: 'r4', name: 'Tom Baker', department: 'Engineering', score: 86, tasksCompleted: 24 },
      { id: 'r5', name: 'Alex Morgan', department: 'Payments', score: 88, tasksCompleted: 15 },
    ],
  };
};
