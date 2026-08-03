import { useEffect, useState } from 'react';
import { TrendingUp, Target, Clock, Award } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import StatCard from '@/components/dashboard/StatCard';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DoughnutChart from '@/components/charts/DoughnutChart';
import { getPerformanceTrends } from '@/services/dashboardService';
import { SkeletonCard } from '@/components/common/Skeleton';

export default function StaffPerformance() {
  const [trends, setTrends] = useState(null);
  const [range, setRange] = useState('weekly');

  useEffect(() => {
    getPerformanceTrends(range).then((res) => setTrends(res.data));
  }, [range]);

  const lineData = trends ? {
    labels: trends.labels,
    datasets: [
      { label: 'Completion %', data: trends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3 },
      { label: 'On-time %', data: trends.onTime, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.08)', fill: true, tension: 0.35, pointRadius: 3 },
    ],
  } : null;

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ label: 'Tasks completed', data: [3, 5, 2, 6, 4], backgroundColor: '#0f172a', borderRadius: 6, barThickness: 28 }],
  };

  const distData = {
    labels: ['Completed', 'In Progress', 'Pending', 'Overdue'],
    datasets: [{ data: [14, 4, 5, 1], backgroundColor: ['#10b981', '#0ea5e9', '#f59e0b', '#ef4444'], borderWidth: 0 }],
  };

  return (
    <div>
      <PageHeader
        title="Performance"
        description="Your productivity metrics and delivery trends over time."
        breadcrumbs={[{ label: 'Home', link: '/staff/dashboard' }, { label: 'Performance' }]}
        actions={
          <div className="flex gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-navy-800 dark:bg-navy-900">
            {[['weekly', 'Weekly'], ['monthly', 'Monthly']].map(([k, label]) => (
              <button key={k} onClick={() => setRange(k)} className={`rounded-md px-3 py-1 text-xs font-medium transition ${range === k ? 'bg-navy-900 text-white dark:bg-navy-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-800'}`}>{label}</button>
            ))}
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} icon={Target} label="Completion rate" value={90} suffix="%" change="+5%" tone="success" />
        <StatCard index={1} icon={Clock} label="On-time delivery" value={86} suffix="%" change="+4%" tone="navy" />
        <StatCard index={2} icon={Award} label="Avg quality score" value={88} suffix="/100" change="+2" tone="warning" />
        <StatCard index={3} icon={TrendingUp} label="Rank in team" value={3} suffix=" of 8" trend="up" tone="info" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Performance trend</h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Completion and on-time delivery over time</p>
          {lineData ? <LineChart data={lineData} height={260} /> : <SkeletonCard />}
        </Card>
        <Card>
          <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Task distribution</h3>
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Current task status breakdown</p>
          <DoughnutChart data={distData} height={260} />
        </Card>
      </div>

      <Card className="mt-6">
        <h3 className="mb-1 text-sm font-semibold text-navy-900 dark:text-gray-100">Daily output this week</h3>
        <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">Tasks completed per day</p>
        <BarChart data={barData} height={220} />
      </Card>
    </div>
  );
}
