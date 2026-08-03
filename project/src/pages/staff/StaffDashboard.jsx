import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckSquare, Clock, AlertTriangle, TrendingUp, CalendarRange,
  ListTodo, ArrowRight, CheckCircle2,
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/charts/LineChart';
import Badge, { statusTone } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { formatRelativeTime } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

const activityIcons = {
  task_completed: CheckCircle2,
  plan_submitted: CalendarRange,
  task_assigned: ListTodo,
  plan_approved: CheckCircle2,
  task_verified: CheckCircle2,
  plan_rejected: AlertTriangle,
};

export default function StaffDashboard() {
  useDashboardData('staff');
  const { stats, performanceTrends, recentActivities, upcomingTasks } = useAppSelector((s) => s.dashboard);

  const lineData = performanceTrends ? {
    labels: performanceTrends.labels,
    datasets: [
      { label: 'Completion %', data: performanceTrends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: '#0f172a' },
      { label: 'On-time %', data: performanceTrends.onTime, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.35, pointRadius: 3, pointBackgroundColor: '#10b981' },
    ],
  } : null;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Your weekly overview — tasks, plans, and performance at a glance."
        breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
        actions={
          <Link to={ROUTES.STAFF_WEEKLY_PLANS}>
            <Button size="sm" icon={CalendarRange}>New weekly plan</Button>
          </Link>
        }
      />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={CheckSquare} label="Tasks completed" value={stats?.completedTasks ?? 14} change="+12%" trend="up" tone="success" />
        <StatCard index={1} icon={Clock} label="Pending tasks" value={stats?.pendingTasks ?? 6} change="-2" trend="down" tone="warning" />
        <StatCard index={2} icon={AlertTriangle} label="Overdue" value={stats?.overdueTasks ?? 1} tone="danger" />
        <StatCard index={3} icon={TrendingUp} label="Avg performance" value={stats?.avgPerformance ?? 88} suffix="%" change="+3%" trend="up" tone="navy" />
      </div>

      {/* Charts + upcoming */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Performance trend</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Completion vs. on-time delivery (last 7 weeks)</p>
            </div>
          </div>
          {lineData ? <LineChart data={lineData} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Upcoming tasks</h3>
          <div className="space-y-3">
            {upcomingTasks.length === 0 ? (
              <p className="text-sm text-gray-500">No upcoming tasks.</p>
            ) : upcomingTasks.slice(0, 4).map((t) => (
              <div key={t.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3 dark:border-navy-800">
                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-navy-50 dark:bg-navy-800">
                  <ListTodo size={14} className="text-navy-600 dark:text-navy-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900 dark:text-gray-100">{t.title}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Badge tone={statusTone(t.status)} dot>{t.status.replace(/_/g, ' ')}</Badge>
                    <span className="text-xs text-gray-400">{formatRelativeTime(t.dueDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link to={ROUTES.STAFF_TASKS} className="mt-3 block">
            <Button variant="ghost" size="sm" iconRight={ArrowRight} className="w-full">View all tasks</Button>
          </Link>
        </Card>
      </div>

      {/* Recent activity + quick actions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Recent activity</h3>
          <div className="space-y-1">
            {recentActivities.map((a, i) => {
              const Icon = activityIcons[a.type] || ListTodo;
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-gray-50 dark:hover:bg-navy-800/50"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 dark:bg-navy-800">
                    <Icon size={14} className="text-gray-500 dark:text-gray-300" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-navy-800 dark:text-gray-200">{a.text}</p>
                    <p className="text-xs text-gray-400">{a.actor} · {formatRelativeTime(a.timestamp)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Quick actions</h3>
          <div className="space-y-2">
            <QuickAction icon={CalendarRange} label="Create weekly plan" to={ROUTES.STAFF_WEEKLY_PLANS} />
            <QuickAction icon={CheckSquare} label="View assigned tasks" to={ROUTES.STAFF_TASKS} />
            <QuickAction icon={TrendingUp} label="View performance" to={ROUTES.STAFF_PERFORMANCE} />
            <QuickAction icon={ListTodo} label="Browse activities" to={ROUTES.STAFF_ACTIVITIES} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({ icon: Icon, label, to }) {
  return (
    <Link to={to} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2.5 text-sm font-medium text-navy-800 transition hover:border-navy-200 hover:bg-navy-50 dark:border-navy-800 dark:text-gray-200 dark:hover:bg-navy-800">
      <span className="flex items-center gap-2.5">
        <Icon size={16} className="text-navy-500" /> {label}
      </span>
      <ArrowRight size={15} className="text-gray-400" />
    </Link>
  );
}
