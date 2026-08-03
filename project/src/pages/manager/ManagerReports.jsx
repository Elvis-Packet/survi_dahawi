import { useEffect, useState } from 'react';
import { FileBarChart, Download, Filter } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import Select from '@/components/common/Select';
import LineChart from '@/components/charts/LineChart';
import BarChart from '@/components/charts/BarChart';
import DataTable from '@/components/tables/DataTable';
import Avatar from '@/components/common/Avatar';
import { getPerformanceTrends, getDepartmentPerformance } from '@/services/dashboardService';
import { getUsers } from '@/services/userService';
import { formatDate } from '@/utils/format';

export default function ManagerReports() {
  const [trends, setTrends] = useState(null);
  const [dept, setDept] = useState(null);
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    getPerformanceTrends('monthly').then((r) => setTrends(r.data));
    getDepartmentPerformance().then((r) => setDept(r.data));
    getUsers({ role: 'staff' }).then((r) => setStaff(r.data.items));
  }, []);

  const lineData = trends ? {
    labels: trends.labels,
    datasets: [{ label: 'Completion %', data: trends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3 }],
  } : null;

  const barData = dept ? {
    labels: dept.labels,
    datasets: [{ label: 'Avg performance', data: dept.values, backgroundColor: '#0f172a', borderRadius: 6, barThickness: 24 }],
  } : null;

  const columns = [
    {
      key: 'name', label: 'Employee', sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="sm" color={u.avatarColor} />
          <div><p className="font-medium text-navy-900 dark:text-gray-100">{u.name}</p><p className="text-xs text-gray-500">{u.title}</p></div>
        </div>
      ),
    },
    { key: 'department', label: 'Department', render: (u) => <Badge tone="navy">{u.department}</Badge> },
    { key: 'performance', label: 'Performance', sortable: true, align: 'center', render: (u) => <span className="font-semibold">{u.performance}</span> },
    { key: 'status', label: 'Status', render: (u) => <Badge tone={statusTone(u.status)} dot>{u.status}</Badge> },
  ];

  return (
    <div>
      <PageHeader
        title="Department Reports"
        description="Team performance analytics and department-level insights."
        breadcrumbs={[{ label: 'Home', link: '/manager/dashboard' }, { label: 'Reports' }]}
        actions={<Button size="sm" variant="secondary" icon={Download}>Export PDF</Button>}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Select className="w-44" options={[{ value: 'all', label: 'All departments' }, { value: 'Payments', label: 'Payments' }, { value: 'Risk', label: 'Risk' }]} placeholder="Department" />
        <Select className="w-36" options={[{ value: 'month', label: 'This month' }, { value: 'quarter', label: 'This quarter' }]} placeholder="Period" />
        <Button variant="secondary" size="sm" icon={Filter}>Apply filters</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Monthly completion trend</h3>
          {lineData ? <LineChart data={lineData} height={240} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>
        <Card>
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Department performance</h3>
          {barData ? <BarChart data={barData} height={240} /> : <div className="h-60 animate-pulse rounded-lg bg-gray-100 dark:bg-navy-800" />}
        </Card>
      </div>

      <Card className="mt-6 p-0">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-navy-800">
          <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Team performance table</h3>
        </div>
        <DataTable columns={columns} data={staff} />
      </Card>
    </div>
  );
}
