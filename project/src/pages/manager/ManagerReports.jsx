import { useEffect, useMemo, useState } from 'react';
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
import { getPlans } from '@/services/planService';
import { formatDate } from '@/utils/format';

export default function ManagerReports() {
  const [trends, setTrends] = useState(null);
  const [dept, setDept] = useState(null);
  const [staff, setStaff] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [reportWeek, setReportWeek] = useState('2026-08-03');
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    getPerformanceTrends('monthly').then((r) => setTrends(r.data));
    getDepartmentPerformance().then((r) => setDept(r.data));
    getUsers({ role: 'staff' }).then((r) => setStaff(r.data.items));
    getPlans({ weekEnd: '2026-08-09' }).then((r) => setPlans(r.data.items));
  }, []);

  const reportRows = useMemo(() => {
    let rows = plans.filter((plan) => plan.weekEnd === reportWeek);
    if (selectedEmployee !== 'all') rows = rows.filter((plan) => plan.ownerId === selectedEmployee);
    if (selectedDept !== 'all') rows = rows.filter((plan) => plan.department === selectedDept);
    return rows;
  }, [plans, reportWeek, selectedDept, selectedEmployee]);

  const lineData = trends ? {
    labels: trends.labels,
    datasets: [{ label: 'Completion %', data: trends.completion, borderColor: '#0f172a', backgroundColor: 'rgba(15,23,42,0.08)', fill: true, tension: 0.35, pointRadius: 3 }],
  } : null;

  const barData = dept ? {
    labels: dept.labels,
    datasets: [{ label: 'Avg performance', data: dept.values, backgroundColor: '#0f172a', borderRadius: 6, barThickness: 24 }],
  } : null;

  const deptOptions = [
    { value: 'all', label: 'All departments' },
    ...Array.from(new Set(staff.map((u) => u.department))).map((department) => ({ value: department, label: department })),
  ];

  const employeeOptions = [
    { value: 'all', label: 'All employees' },
    ...staff.map((u) => ({ value: u.id, label: u.name })),
  ];

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
        description="Team performance analytics and department-level insights for Sunday weekly reporting."
        breadcrumbs={[{ label: 'Home', link: '/manager/dashboard' }, { label: 'Reports' }]}
        actions={<Button size="sm" variant="secondary" icon={Download}>Export PDF</Button>}
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <Select className="w-44" options={deptOptions} placeholder="Department" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)} />
        <Select className="w-52" options={employeeOptions} placeholder="Employee" value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)} />
        <Select className="w-44" options={[{ value: '2026-08-09', label: 'Week ending Sunday, Aug 09' }, { value: '2026-08-02', label: 'Week ending Sunday, Aug 02' }, { value: '2026-07-26', label: 'Week ending Sunday, Jul 26' }]} placeholder="Weekly cycle" value={reportWeek} onChange={(e) => setReportWeek(e.target.value)} />
        <Button variant="secondary" size="sm" icon={Filter} onClick={() => setGenerated(true)}>Generate Sunday report</Button>
      </div>

      {generated && (
        <Card className="mb-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Sunday weekly report</p>
              <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">{selectedEmployee === 'all' ? 'All employees' : staff.find((u) => u.id === selectedEmployee)?.name} · {selectedDept === 'all' ? 'All departments' : selectedDept}</h3>
            </div>
            <Badge tone="navy">Week ending {formatDate(reportWeek)}</Badge>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-800/60">
              <p className="text-xs text-gray-500">Plans in cycle</p>
              <p className="mt-1 text-lg font-semibold text-navy-900 dark:text-gray-100">{reportRows.length}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-800/60">
              <p className="text-xs text-gray-500">Reviewed</p>
              <p className="mt-1 text-lg font-semibold text-navy-900 dark:text-gray-100">{reportRows.filter((plan) => plan.status !== 'submitted').length}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-800/60">
              <p className="text-xs text-gray-500">Pending review</p>
              <p className="mt-1 text-lg font-semibold text-navy-900 dark:text-gray-100">{reportRows.filter((plan) => plan.status === 'submitted').length}</p>
            </div>
          </div>
        </Card>
      )}

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

      {generated && (
        <Card className="mt-6 p-0">
          <div className="border-b border-gray-200 px-5 py-4 dark:border-navy-800">
            <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Sunday weekly plan snapshot</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-navy-800">
            {reportRows.length === 0 ? (
              <div className="p-5 text-sm text-gray-500">No plan records matched the selected Sunday report filter.</div>
            ) : (
              reportRows.map((plan) => (
                <div key={plan.id} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{plan.ownerName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{plan.weekLabel} · {plan.department} · {plan.goals?.length || 0} goals</p>
                  </div>
                  <Badge tone={statusTone(plan.status)} dot>{plan.status}</Badge>
                </div>
              ))
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
