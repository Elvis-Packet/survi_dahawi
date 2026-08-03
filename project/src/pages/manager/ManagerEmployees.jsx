import { useEffect, useState } from 'react';
import { Users, Eye } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Avatar from '@/components/common/Avatar';
import Badge, { statusTone } from '@/components/common/Badge';
import SearchBar from '@/components/common/SearchBar';
import Select from '@/components/common/Select';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import ProfileCard from '@/components/common/ProfileCard';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setUsers } from '@/redux/slices/userSlice';
import { getUsers } from '@/services/userService';
import { useTable } from '@/hooks/useTable';
import { ROLE_LABELS } from '@/constants/roles';
import { formatDate } from '@/utils/format';

export default function ManagerEmployees() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const table = useTable(users, { initialSort: { key: 'name', dir: 'asc' } });

  useEffect(() => {
    getUsers({ role: 'staff' }).then((res) => {
      dispatch(setUsers(res.data));
      setLoading(false);
    });
  }, [dispatch]);

  const columns = [
    {
      key: 'name', label: 'Employee', sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="sm" color={u.avatarColor} />
          <div>
            <p className="font-medium text-navy-900 dark:text-gray-100">{u.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{u.title}</p>
          </div>
        </div>
      ),
    },
    { key: 'department', label: 'Department', sortable: true,
      render: (u) => <Badge tone="navy">{u.department}</Badge> },
    { key: 'role', label: 'Role', render: (u) => ROLE_LABELS[u.role] },
    { key: 'performance', label: 'Performance', sortable: true, align: 'center',
      render: (u) => (
        <div className="flex items-center justify-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700">
            <div className={`h-full rounded-full ${u.performance >= 90 ? 'bg-emerald-500' : u.performance >= 75 ? 'bg-navy-500' : 'bg-amber-500'}`} style={{ width: `${u.performance}%` }} />
          </div>
          <span className="text-xs font-semibold text-navy-800 dark:text-gray-200">{u.performance}</span>
        </div>
      ) },
    { key: 'status', label: 'Status',
      render: (u) => <Badge tone={statusTone(u.status)} dot>{u.status}</Badge> },
    { key: 'lastLogin', label: 'Last active', sortable: true,
      render: (u) => <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(u.lastLogin)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Employees"
        description="View team members, performance, and activity."
        breadcrumbs={[{ label: 'Home', link: '/manager/dashboard' }, { label: 'Employees' }]}
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-navy-800">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search employees…" className="sm:w-64" onClear={() => table.setSearch('')} />
          <div className="flex gap-2">
            <Select
              value={table.filters.department || 'all'}
              onChange={(e) => table.setFilter('department', e.target.value)}
              options={[
                { value: 'all', label: 'All departments' },
                ...Array.from(new Set(users.map((u) => u.department))).map((d) => ({ value: d, label: d })),
              ]}
              className="w-44"
            />
            <Select
              value={table.filters.status || 'all'}
              onChange={(e) => table.setFilter('status', e.target.value)}
              options={[
                { value: 'all', label: 'All status' },
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
              ]}
              className="w-36"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading employees…</div>
        ) : table.paginated.length === 0 ? (
          <EmptyState icon={Users} title="No employees found" description="Try adjusting your search or filters." />
        ) : (
          <>
            <DataTable
              columns={columns}
              data={table.paginated}
              onRowClick={(u) => setSelected(u)}
              sortKey={table.sortKey}
              sortDir={table.sortDir}
              onSort={table.toggleSort}
            />
            <Pagination
              page={table.page}
              totalPages={table.totalPages}
              onPageChange={table.setPage}
              pageSize={table.pageSize}
              onPageSizeChange={table.setPageSize}
              total={table.total}
            />
          </>
        )}
      </Card>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title="Employee profile" size="md">
        {selected && <ProfileCard user={selected} />}
      </Modal>
    </div>
  );
}
