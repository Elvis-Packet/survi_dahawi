import { useEffect, useState } from 'react';
import { ScrollText, Filter, Download } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import SearchBar from '@/components/common/SearchBar';
import Select from '@/components/common/Select';
import DataTable from '@/components/tables/DataTable';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import { getAuditLogs } from '@/services/auditService';
import { useTable } from '@/hooks/useTable';
import { formatDateTime } from '@/utils/format';

const severityTone = { low: 'neutral', medium: 'warning', high: 'danger' };

export default function CeoAuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const table = useTable(logs, { initialSort: { key: 'timestamp', dir: 'desc' } });

  useEffect(() => {
    getAuditLogs().then((res) => { setLogs(res.data.items); setLoading(false); });
  }, []);

  const columns = [
    {
      key: 'actorName', label: 'Actor', sortable: true,
      render: (l) => (
        <div className="flex items-center gap-2">
          <Avatar name={l.actorName} size="xs" />
          <div><p className="text-sm font-medium text-navy-900 dark:text-gray-100">{l.actorName}</p><p className="text-xs text-gray-500">{l.actor}</p></div>
        </div>
      ),
    },
    { key: 'action', label: 'Action', sortable: true, render: (l) => <span className="font-mono text-xs font-medium text-navy-800 dark:text-gray-200">{l.action}</span> },
    { key: 'targetName', label: 'Target', render: (l) => <span className="text-sm">{l.targetName}</span> },
    { key: 'details', label: 'Details', render: (l) => <span className="text-xs text-gray-500 dark:text-gray-400">{l.details}</span> },
    { key: 'severity', label: 'Severity', render: (l) => <Badge tone={severityTone[l.severity]} dot>{l.severity}</Badge> },
    { key: 'ipAddress', label: 'IP', render: (l) => <span className="font-mono text-xs text-gray-500">{l.ipAddress}</span> },
    { key: 'timestamp', label: 'Timestamp', sortable: true, render: (l) => <span className="text-xs text-gray-500">{formatDateTime(l.timestamp)}</span> },
  ];

  return (
    <div>
      <PageHeader
        title="Audit Logs"
        description="A complete trail of system actions for compliance and security."
        breadcrumbs={[{ label: 'Home', link: '/ceo/dashboard' }, { label: 'Audit Logs' }]}
        actions={<Button size="sm" variant="secondary" icon={Download}>Export</Button>}
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-navy-800">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search logs…" className="sm:w-64" onClear={() => table.setSearch('')} />
          <div className="flex gap-2">
            <Select value={table.filters.severity || 'all'} onChange={(e) => table.setFilter('severity', e.target.value)}
              options={[{ value: 'all', label: 'All severity' }, { value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }]} className="w-36" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading audit logs…</div>
        ) : table.paginated.length === 0 ? (
          <EmptyState icon={ScrollText} title="No audit logs" description="System actions will be recorded here." />
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
