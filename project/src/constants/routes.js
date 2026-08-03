export const ROUTES = {
  // Auth
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  UNAUTHORIZED: '/unauthorized',

  // Staff
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_WEEKLY_PLANS: '/staff/weekly-plans',
  STAFF_ACTIVITIES: '/staff/activities',
  STAFF_TASKS: '/staff/tasks',
  STAFF_PERFORMANCE: '/staff/performance',
  STAFF_NOTIFICATIONS: '/staff/notifications',
  STAFF_PROFILE: '/staff/profile',

  // Manager
  MANAGER_DASHBOARD: '/manager/dashboard',
  MANAGER_EMPLOYEES: '/manager/employees',
  MANAGER_WEEKLY_PLANS: '/manager/weekly-plans',
  MANAGER_ASSIGN_TASKS: '/manager/assign-tasks',
  MANAGER_VERIFICATION: '/manager/verification',
  MANAGER_REPORTS: '/manager/reports',
  MANAGER_NOTIFICATIONS: '/manager/notifications',
  MANAGER_PROFILE: '/manager/profile',

  // CEO
  CEO_DASHBOARD: '/ceo/dashboard',
  CEO_USERS: '/ceo/users',
  CEO_DEPARTMENTS: '/ceo/departments',
  CEO_REPORTS: '/ceo/reports',
  CEO_AUDIT_LOGS: '/ceo/audit-logs',
  CEO_LOGIN_HISTORY: '/ceo/login-history',
  CEO_ORG_ANALYTICS: '/ceo/organization-analytics',
  CEO_SETTINGS: '/ceo/settings',
  CEO_NOTIFICATIONS: '/ceo/notifications',
};

export const ROLE_DASHBOARD = {
  staff: ROUTES.STAFF_DASHBOARD,
  manager: ROUTES.MANAGER_DASHBOARD,
  ceo: ROUTES.CEO_DASHBOARD,
};
