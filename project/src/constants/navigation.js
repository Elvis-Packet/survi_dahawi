import {
  LayoutDashboard,
  CalendarRange,
  ListTodo,
  CheckSquare,
  BarChart3,
  Bell,
  User,
  Users,
  ClipboardCheck,
  FileBarChart,
  Building2,
  ScrollText,
  LogIn,
  Settings,
  TrendingUp,
  UserPlus,
} from 'lucide-react';
import { ROUTES } from './routes';
import { ROLES } from './roles';

export const NAV_ITEMS = {
  staff: [
    { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.STAFF_DASHBOARD },
    { label: 'Weekly Plans', icon: CalendarRange, path: ROUTES.STAFF_WEEKLY_PLANS },
    { label: 'Activities', icon: ListTodo, path: ROUTES.STAFF_ACTIVITIES },
    { label: 'Assigned Tasks', icon: CheckSquare, path: ROUTES.STAFF_TASKS },
    { label: 'Performance', icon: BarChart3, path: ROUTES.STAFF_PERFORMANCE },
    { label: 'Notifications', icon: Bell, path: ROUTES.STAFF_NOTIFICATIONS },
    { label: 'Profile', icon: User, path: ROUTES.STAFF_PROFILE },
  ],
  manager: [
    { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.MANAGER_DASHBOARD },
    { label: 'Employees', icon: Users, path: ROUTES.MANAGER_EMPLOYEES },
    { label: 'Weekly Plans', icon: CalendarRange, path: ROUTES.MANAGER_WEEKLY_PLANS },
    { label: 'Assign Tasks', icon: UserPlus, path: ROUTES.MANAGER_ASSIGN_TASKS },
    { label: 'Verification', icon: ClipboardCheck, path: ROUTES.MANAGER_VERIFICATION },
    { label: 'Department Reports', icon: FileBarChart, path: ROUTES.MANAGER_REPORTS },
    { label: 'Notifications', icon: Bell, path: ROUTES.MANAGER_NOTIFICATIONS },
    { label: 'Profile', icon: User, path: ROUTES.MANAGER_PROFILE },
  ],
  ceo: [
    { label: 'Dashboard', icon: LayoutDashboard, path: ROUTES.CEO_DASHBOARD },
    { label: 'Users', icon: Users, path: ROUTES.CEO_USERS },
    { label: 'Departments', icon: Building2, path: ROUTES.CEO_DEPARTMENTS },
    { label: 'Reports', icon: FileBarChart, path: ROUTES.CEO_REPORTS },
    { label: 'Audit Logs', icon: ScrollText, path: ROUTES.CEO_AUDIT_LOGS },
    { label: 'Login History', icon: LogIn, path: ROUTES.CEO_LOGIN_HISTORY },
    { label: 'Org Analytics', icon: TrendingUp, path: ROUTES.CEO_ORG_ANALYTICS },
    { label: 'Settings', icon: Settings, path: ROUTES.CEO_SETTINGS },
    { label: 'Notifications', icon: Bell, path: ROUTES.CEO_NOTIFICATIONS },
  ],
};

export const ROLE_NAV = NAV_ITEMS;

export const getNavForRole = (role) => NAV_ITEMS[role] || [];

export const ALL_ROLES = [ROLES.CEO, ROLES.MANAGER, ROLES.STAFF];
