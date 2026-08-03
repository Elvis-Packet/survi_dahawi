import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Users, UserPlus, Trash2, Ban, CheckCircle2, Eye } from 'lucide-react';
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
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Input from '@/components/common/Input';
import SelectForm from '@/components/common/Select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setUsers, addUser, updateUserInList, removeUser } from '@/redux/slices/userSlice';
import { getUsers, createUser, suspendUser, activateUser, deleteUser } from '@/services/userService';
import { useTable } from '@/hooks/useTable';
import { ROLE_LABELS } from '@/constants/roles';
import { MOCK_DEPARTMENTS } from '@/data/departments';
import { formatDate } from '@/utils/format';

export default function CeoUsers() {
  const dispatch = useAppDispatch();
  const { users } = useAppSelector((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [viewUser, setViewUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'staff', department: 'Payments', title: '' });
  const table = useTable(users, { initialSort: { key: 'name', dir: 'asc' } });

  useEffect(() => {
    getUsers().then((res) => { dispatch(setUsers(res.data)); setLoading(false); });
  }, [dispatch]);

  const handleCreate = async () => {
    if (!form.name || !form.email) { toast.error('Name and email are required'); return; }
    setCreating(true);
    try {
      const res = await createUser(form);
      dispatch(addUser(res.data));
      setCreateOpen(false);
      setForm({ name: '', email: '', role: 'staff', department: 'Payments', title: '' });
      toast.success('User created');
    } catch { toast.error('Could not create user'); }
    finally { setCreating(false); }
  };

  const toggleStatus = async (user) => {
    try {
      const res = user.status === 'active' ? await suspendUser(user.id) : await activateUser(user.id);
      dispatch(updateUserInList(res.data));
      toast.success(user.status === 'active' ? 'User suspended' : 'User activated');
    } catch { toast.error('Action failed'); }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(confirmDelete.id);
      dispatch(removeUser(confirmDelete.id));
      toast.success('User deleted');
      setConfirmDelete(null);
    } catch { toast.error('Could not delete user'); }
  };

  const columns = [
    {
      key: 'name', label: 'User', sortable: true,
      render: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="sm" color={u.avatarColor} />
          <div><p className="font-medium text-navy-900 dark:text-gray-100">{u.name}</p><p className="text-xs text-gray-500 dark:text-gray-400">{u.email}</p></div>
        </div>
      ),
    },
    { key: 'role', label: 'Role', sortable: true, render: (u) => <Badge tone="navy">{ROLE_LABELS[u.role]}</Badge> },
    { key: 'department', label: 'Department', sortable: true, render: (u) => u.department },
    { key: 'performance', label: 'Perf', sortable: true, align: 'center', render: (u) => <span className="font-semibold">{u.performance}</span> },
    { key: 'status', label: 'Status', render: (u) => <Badge tone={statusTone(u.status)} dot>{u.status}</Badge> },
    { key: 'joinedAt', label: 'Joined', sortable: true, render: (u) => <span className="text-xs text-gray-500">{formatDate(u.joinedAt)}</span> },
    {
      key: 'actions', label: '', align: 'right',
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setViewUser(u)} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-600 dark:hover:bg-navy-800" title="View"><Eye size={15} /></button>
          <button onClick={() => toggleStatus(u)} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-600 dark:hover:bg-navy-800" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
            {u.status === 'active' ? <Ban size={15} /> : <CheckCircle2 size={15} />}
          </button>
          <button onClick={() => setConfirmDelete(u)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Delete"><Trash2 size={15} /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="User Management"
        description="Create, manage, and oversee all users in the organization."
        breadcrumbs={[{ label: 'Home', link: '/ceo/dashboard' }, { label: 'Users' }]}
        actions={<Button size="sm" icon={UserPlus} onClick={() => setCreateOpen(true)}>Add user</Button>}
      />

      <Card className="p-0">
        <div className="flex flex-col gap-3 border-b border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-navy-800">
          <SearchBar value={table.search} onChange={table.setSearch} placeholder="Search users…" className="sm:w-64" onClear={() => table.setSearch('')} />
          <div className="flex gap-2">
            <Select value={table.filters.role || 'all'} onChange={(e) => table.setFilter('role', e.target.value)}
              options={[{ value: 'all', label: 'All roles' }, { value: 'staff', label: 'Staff' }, { value: 'manager', label: 'Manager' }, { value: 'ceo', label: 'CEO' }]} className="w-36" />
            <Select value={table.filters.status || 'all'} onChange={(e) => table.setFilter('status', e.target.value)}
              options={[{ value: 'all', label: 'All status' }, { value: 'active', label: 'Active' }, { value: 'suspended', label: 'Suspended' }]} className="w-36" />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading users…</div>
        ) : table.paginated.length === 0 ? (
          <EmptyState icon={Users} title="No users found" />
        ) : (
          <>
            <DataTable columns={columns} data={table.paginated} sortKey={table.sortKey} sortDir={table.sortDir} onSort={table.toggleSort} />
            <Pagination page={table.page} totalPages={table.totalPages} onPageChange={table.setPage} pageSize={table.pageSize} onPageSizeChange={table.setPageSize} total={table.total} />
          </>
        )}
      </Card>

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add new user" description="Create a new account. The user will receive an invitation email." size="md"
        footer={<><Button variant="secondary" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button><Button size="sm" loading={creating} onClick={handleCreate}>Create user</Button></>}>
        <div className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@vertexfin.com" />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectForm label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={[{ value: 'staff', label: 'Staff' }, { value: 'manager', label: 'Manager' }, { value: 'ceo', label: 'CEO' }]} />
            <SelectForm label="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
              options={MOCK_DEPARTMENTS.filter((d) => d.id !== 'dep_00').map((d) => ({ value: d.name, label: d.name }))} />
          </div>
          <Input label="Job title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Senior Analyst" />
        </div>
      </Modal>

      {/* View modal */}
      <Modal open={Boolean(viewUser)} onClose={() => setViewUser(null)} title="User details" size="md">
        {viewUser && (
          <div className="flex flex-col items-center gap-3 py-2 text-center">
            <Avatar name={viewUser.name} size="xl" color={viewUser.avatarColor} ring />
            <div>
              <p className="text-base font-semibold text-navy-900 dark:text-gray-100">{viewUser.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{viewUser.title}</p>
            </div>
            <div className="flex gap-2">
              <Badge tone="navy">{ROLE_LABELS[viewUser.role]}</Badge>
              <Badge tone={statusTone(viewUser.status)} dot>{viewUser.status}</Badge>
            </div>
            <div className="mt-2 w-full space-y-2 border-t border-gray-100 pt-3 text-left text-sm dark:border-navy-800">
              <Row label="Email" value={viewUser.email} />
              <Row label="Department" value={viewUser.department} />
              <Row label="Performance" value={`${viewUser.performance}/100`} />
              <Row label="Joined" value={formatDate(viewUser.joinedAt)} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete}
        title="Delete user?" message={`This will permanently delete ${confirmDelete?.name}. This action cannot be undone.`} confirmLabel="Delete user" />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-navy-800 dark:text-gray-200">{value}</span>
    </div>
  );
}
