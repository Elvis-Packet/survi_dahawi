import { ROLES, ROLE_HIERARCHY } from '@/constants/roles';

export const hasRole = (currentRole, allowedRoles) =>
  Array.isArray(allowedRoles)
    ? allowedRoles.includes(currentRole)
    : currentRole === allowedRoles;

export const isAtLeast = (currentRole, minRole) =>
  ROLE_HIERARCHY[currentRole] >= ROLE_HIERARCHY[minRole];

export const can = {
  viewAllUsers: (role) => role === ROLES.CEO || role === ROLES.MANAGER,
  manageUsers: (role) => role === ROLES.CEO,
  manageDepartments: (role) => role === ROLES.CEO,
  viewAuditLogs: (role) => role === ROLES.CEO,
  assignTasks: (role) => role === ROLES.MANAGER || role === ROLES.CEO,
  approvePlans: (role) => role === ROLES.MANAGER || role === ROLES.CEO,
  verifyTasks: (role) => role === ROLES.MANAGER || role === ROLES.CEO,
  viewOrgAnalytics: (role) => role === ROLES.CEO,
  viewSystemSettings: (role) => role === ROLES.CEO,
};
