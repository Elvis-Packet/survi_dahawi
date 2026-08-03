import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, ClipboardCheck, CalendarRange, TrendingUp,
  CheckCircle2, AlertTriangle, ArrowRight, UserPlus, FileBarChart,
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import Avatar from '@/components/common/Avatar';
import Badge, { statusTone } from '@/components/common/Badge';
import Button from '@/components/common/Button';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { getEmployeeRankings } from '@/services/dashboardService';
import { useEffect, useState } from 'react';
import { formatRelativeTime } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export default function ManagerDashboard() {
  useDashboardData('manager');
  const { stats, performanceTrends, departmentPerformance, recentActivities } = useAppSelector((s) => s.dashboard);
  const [rankings, setRankings] = useState([]);

  useEffect(() => { getEmployeeRankings().then((res) => setRankings(res.data)); }, []);

  const lineData = performanceTrends ? {
    labels: performanceTrends.labels,
    datasets: [
      { label: 'Team completion %', data: performanceTrends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3 },
      { label: 'On-time %', data: performanceTrends.onTime, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.35, pointRadius: 3 },
    ],
  } : null;

  const barData = departmentPerformance ? {
    labels: departmentPerformance.labels,
    datasets: [{ label: 'Avg performance', data: departmentPerformance.values, backgroundColor: '#0f172a', borderRadius: 6, barThickness: 24 }],
  } : null;

  return (
    <div>
      <PageHeader
        title="Manager Dashboard"
        description="Team performance, pending reviews, and department overview."
        breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
        actions={
          <Link to={ROUTES.MANAGER_ASSIGN_TASKS}><Button size="sm" icon={UserPlus}>Assign task</Button></Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={Users} label="Team members" value={stats?.teamMembers ?? 8} tone="navy" />
        <StatCard index={1} icon={CalendarRange} label="Plans to review" value={stats?.plansPendingReview ?? 2} tone="warning" />
        <StatCard index={2} icon={ClipboardCheck} label="Tasks to verify" value={stats?.tasksPendingVerification ?? 3} tone="info" />
        <StatCard index={3} icon={TrendingUp} label="Team avg performance" value={stats?.avgPerformance ?? 86} suffix="%" change="+3%" tone="success" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Team performance trend</h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Completion and on-time delivery across the team</p>
          {lineData ? <LineChart data={lineData} height={260} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Employee rankings</h3>
          <div className="space-y-2">
            {rankings.slice(0, 5).map((r, i) => (
              <div key={r.id} className="flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-gray-50 dark:hover:bg-navy-800/50">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i < 3 ? 'bg-navy-900 text-white' : 'bg-gray-100 text-gray-500 dark:bg-navy-800 dark:text-gray-400'}`}>{i + 1}</span>
                <Avatar name={r.name} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-navy-900 dark:text-gray-100">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.department}</p>
                </div>
                <span className="text-sm font-bold text-navy-800 dark:text-gray-200">{r.score}</span>
              </div>
            ))}
          </div>
          <Link to={ROUTES.MANAGER_EMPLOYEES} className="mt-3 block">
            <Button variant="ghost" size="sm" iconRight={ArrowRight} className="w-full">View all employees</Button>
          </Link>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Department performance</h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Average performance score by department</p>
          {barData ? <BarChart data={barData} height={240} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Recent team activity</h3>
          <div className="space-y-2">
            {recentActivities.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-navy-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-navy-800 dark:text-gray-200">{a.text}</p>
                  <p className="text-xs text-gray-400">{formatRelativeTime(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <QuickLink icon={CalendarRange} title="Review weekly plans" desc={`${stats?.plansPendingReview ?? 2} pending`} to={ROUTES.MANAGER_WEEKLY_PLANS} />
        <QuickLink icon={ClipboardCheck} title="Verify activities" desc={`${stats?.tasksPendingVerification ?? 3} pending`} to={ROUTES.MANAGER_VERIFICATION} />
        <QuickLink icon={FileBarChart} title="Department reports" desc="View analytics" to={ROUTES.MANAGER_REPORTS} />
      </div>
    </div>
  );
}

function QuickLink({ icon: Icon, title, desc, to }) {
  return (
    <Link to={to}>
      <Card hover className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-100 dark:bg-navy-800">
          <Icon size={20} className="text-navy-600 dark:text-navy-300" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{title}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
        </div>
        <ArrowRight size={16} className="text-gray-400" />
      </Card>
    </Link>
  );
}
