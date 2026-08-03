import { useEffect, useState } from 'react';
import { TrendingUp, Users, Building2, Target, Award, Activity } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import { getPerformanceTrends, getDepartmentPerformance } from '@/services/dashboardService';
import { getOrgKpis } from '@/services/reportService';
import { ORG_KPIS } from '@/data/reports';
import { formatCompact, formatCurrency } from '@/utils/format';

export default function CeoOrgAnalytics() {
  const [trends, setTrends] = useState(null);
  const [dept, setDept] = useState(null);
  const [kpis, setKpis] = useState(ORG_KPIS);

  useEffect(() => {
    getPerformanceTrends('monthly').then((r) => setTrends(r.data));
    getDepartmentPerformance().then((r) => setDept(r.data));
    getOrgKpis().then((r) => setKpis(r.data));
  }, []);

  const lineData = trends ? {
    labels: trends.labels,
    datasets: [
      { label: 'Completion %', data: trends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3 },
      { label: 'On-time %', data: trends.onTime, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.35, pointRadius: 3 },
    ],
  } : null;

  const barData = dept ? {
    labels: dept.labels,
    datasets: [{ label: 'Performance', data: dept.values, backgroundColor: '#0f172a', borderRadius: 6, barThickness: 22 }],
  } : null;

  const headcountData = {
    labels: ['Payments', 'Compliance', 'Risk', 'Operations', 'Finance', 'Engineering'],
    datasets: [{ data: [18, 9, 11, 14, 7, 23], backgroundColor: ['#0f172a', '#1e3568', '#2b4683', '#3a5ca5', '#5a7cbe', '#8da7d4'], borderWidth: 0 }],
  };

  return (
    <div>
      <PageHeader
        title="Organization Analytics"
        description="Deep insights into headcount, performance, and productivity across the company."
        breadcrumbs={[{ label: 'Home', link: '/ceo/dashboard' }, { label: 'Org Analytics' }]}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={Users} label="Total headcount" value={kpis.totalEmployees} change="+4" tone="navy" />
        <StatCard index={1} icon={Building2} label="Departments" value={kpis.departments} tone="info" />
        <StatCard index={2} icon={Target} label="Plans approved" value={kpis.plansApprovedRate} suffix="%" tone="success" />
        <StatCard index={3} icon={Award} label="Avg performance" value={kpis.avgPerformance} suffix="%" change="+3%" tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Performance trends</h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Monthly completion and on-time delivery</p>
          {lineData ? <LineChart data={lineData} height={260} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Headcount by department</h3>
          <DoughnutChart data={headcountData} height={260} />
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Department performance comparison</h3>
          {barData ? <BarChart data={barData} height={240} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Key metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <Metric icon={Activity} label="Tasks completed (mo)" value={formatCompact(kpis.tasksCompletedThisMonth)} tone="success" />
            <Metric icon={Target} label="Tasks pending" value={formatCompact(kpis.tasksPending)} tone="warning" />
            <Metric icon={TrendingUp} label="Plan approval rate" value={`${kpis.plansApprovedRate}%`} tone="navy" />
            <Metric icon={Users} label="Active employees" value={kpis.activeEmployees} tone="info" />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Metric({ icon: Icon, label, value, tone }) {
  const tones = { navy: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200', success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300', warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300', info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' };
  return (
    <div className="rounded-lg border border-gray-100 p-4 dark:border-navy-800">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${tones[tone]}`}><Icon size={16} /></div>
      <p className="text-xl font-bold text-navy-900 dark:text-gray-100">{value}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
  );
}
