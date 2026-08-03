import { Link } from 'react-router-dom';
import {
  Users, Building2, TrendingUp, AlertTriangle, FileBarChart,
  ScrollText, ArrowRight, CheckCircle2, Activity,
} from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { getRecentActivities } from '@/services/dashboardService';
import { useEffect, useState } from 'react';
import { ORG_KPIS } from '@/data/reports';
import { formatRelativeTime } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

export default function CeoDashboard() {
  useDashboardData('ceo');
  const { performanceTrends, departmentPerformance } = useAppSelector((s) => s.dashboard);
  const [activities, setActivities] = useState([]);

  useEffect(() => { getRecentActivities(8).then((r) => setActivities(r.data)); }, []);

  const lineData = performanceTrends ? {
    labels: performanceTrends.labels,
    datasets: [{ label: 'Org completion %', data: performanceTrends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3 }],
  } : null;

  const barData = departmentPerformance ? {
    labels: departmentPerformance.labels,
    datasets: [{ label: 'Performance', data: departmentPerformance.values, backgroundColor: '#0f172a', borderRadius: 6, barThickness: 22 }],
  } : null;

  const distData = {
    labels: ['Completed', 'Pending', 'Overdue'],
    datasets: [{ data: [412, 67, 2], backgroundColor: ['#10b981', '#f59e0b', '#ef4444'], borderWidth: 0 }],
  };

  return (
    <div>
      <PageHeader
        title="Organization Dashboard"
        description="Complete visibility across departments, people, and performance."
        breadcrumbs={[{ label: 'Home' }, { label: 'Dashboard' }]}
        actions={<Link to={ROUTES.CEO_REPORTS}><Button size="sm" icon={FileBarChart}>View reports</Button></Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={Users} label="Total employees" value={ORG_KPIS.totalEmployees} change="+4" tone="navy" />
        <StatCard index={1} icon={TrendingUp} label="Avg performance" value={ORG_KPIS.avgPerformance} suffix="%" change="+3%" tone="success" />
        <StatCard index={2} icon={CheckCircle2} label="Tasks completed (mo)" value={ORG_KPIS.tasksCompletedThisMonth} change="+18%" tone="info" />
        <StatCard index={3} icon={AlertTriangle} label="Open incidents" value={ORG_KPIS.openIncidents} tone="danger" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Organization performance trend</h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Task completion rate across the organization</p>
          {lineData ? <LineChart data={lineData} height={260} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Task distribution</h3>
          <DoughnutChart data={distData} height={260} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Department performance comparison</h3>
          {barData ? <BarChart data={barData} height={240} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>
        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Organization activity</h3>
          <div className="space-y-2">
            {activities.slice(0, 6).map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 rounded-lg px-2 py-2">
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-navy-400" />
                <div className="min-w-0">
                  <p className="truncate text-sm text-navy-800 dark:text-gray-200">{a.text}</p>
                  <p className="text-xs text-gray-400">{a.actor} · {formatRelativeTime(a.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickLink icon={Users} title="User management" desc={`${ORG_KPIS.totalEmployees} users`} to={ROUTES.CEO_USERS} />
        <QuickLink icon={Building2} title="Departments" desc={`${ORG_KPIS.departments} departments`} to={ROUTES.CEO_DEPARTMENTS} />
        <QuickLink icon={ScrollText} title="Audit logs" desc="System activity" to={ROUTES.CEO_AUDIT_LOGS} />
        <QuickLink icon={Activity} title="Org analytics" desc="Deep insights" to={ROUTES.CEO_ORG_ANALYTICS} />
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
