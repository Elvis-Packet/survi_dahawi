import { useEffect, useState } from 'react';
import { LogIn, Download } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import SearchBar from '@/components/common/SearchBar';
import Select from '@/components/common/Select';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { getLoginHistory } from '@/services/auditService';
import { useTable } from '@/hooks/useTable';
import { formatDateTime } from '@/utils/format';
import { ROLE_LABELS } from '@/constants/roles';

export default function CeoLoginHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const table = useTable(history, { initialSort: { key: 'timestamp', dir: 'desc' } });

  useEffect(() => {
    getLoginHistory().then((res) => { setHistory(res.data.items); setLoading(false); });
  }, []);

  const columns = [
    {
      key: 'userName', label: 'User', sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2">
          <Avatar name={l.userName} size="xs" />
          <div><p className="text-sm font-medium text-navy-900 dark:text-gray-100">{l.userName}</p><p className="text-xs text-gray-500">{l.user}</p></div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', render: (l) => <Badge tone="navy">{ROLE_LABELS[l.role] || l.role}</Badge> },
    { key: 'location', label: 'Location', render: (l) => <span className="text-sm">{l.location}</span> },
    { key: 'ipAddress', label: 'IP address', render: (l) => <span className="font-mono text-xs text-gray-500">{l.ipAddress}</span> },
    { key: 'device', label: 'Device', render: (l) => <span className="text-xs text-gray-500">{l.device}</span> },
    { key: 'status', label: 'Status', render: (l) => <Badge tone={statusTone(l.status === 'success' ? 'active' : 'suspended')} dot>{l.status}</Badge> },
    { key: 'timestamp', label: 'Time', sortable: true, render: (l) => <span className="text-xs text-gray-500">{formatDateTime(l.timestamp)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Login History"
        description="Track all sign-in attempts across the organization."
        breadcrumbs={[{ label: 'Home', link: '/ceo/dashboard' }, { label: 'Login History' }]}
        actions={<Button size="sm" variant="secondary" icon={Download}>Export</Button>}
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-navy-800">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search by user or IP…" className="sm:w-64" onClear={() => table.setSearch('')} />
          <Select value={table.filters.status || 'all'} onChange={(e) => table.setFilter('status', e.target.value)}
            options={[{ value: 'all', label: 'All attempts' }, { value: 'success', label: 'Successful' }, { value: 'failed', label: 'Failed' }]} className="w-36" />
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading login history…</div>
        ) : table.paginated.length === 0 ? (
          <EmptyState icon={LogIn} title="No login records" />
        ) : (
          <>
            <DataTable columns={columns} data={table.paginated} sortKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
            <Pagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} total={table.total} />
          </>
        )}
      </Card>
    </div>
  );
}
