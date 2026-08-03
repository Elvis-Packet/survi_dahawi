import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Building2, Plus, Trash2, Pencil, Users as UsersIcon } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setDepartments, addDepartment, updateDepartmentInList, removeDepartment } from '@/redux/slices/departmentSlice';
import { getDepartments, createDepartment, updateDepartment, deleteDepartment } from '@/services/departmentService';
import { formatCurrency } from '@/utils/format';

export default function CeoDepartments() {
  const dispatch = useAppDispatch();
  const { departments } = useAppSelector((s) => s.department);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', head: '', budget: 0 });

  useEffect(() => {
    getDepartments().then((res) => { dispatch(setDepartments(res.data)); setLoading(false); });
  }, [dispatch]);

  const openNew = () => { setEditing(null); setForm({ name: '', head: '', budget: 0 }); setModalOpen(true); };
  const openEdit = (d) => { setEditing(d); setForm({ name: d.name, head: d.head, budget: d.budget }); setModalOpen(true); };

  const save = async () => {
    if (!form.name) { toast.error('Department name is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        const res = await updateDepartment(editing.id, form);
        dispatch(updateDepartmentInList(res.data));
        toast.success('Department updated');
      } else {
        const res = await createDepartment(form);
        dispatch(addDepartment(res.data));
        toast.success('Department created');
      }
      setModalOpen(false);
    } catch { toast.error('Could not save department'); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    try {
      await deleteDepartment(confirmDelete.id);
      dispatch(removeDepartment(confirmDelete.id));
      toast.success('Department deleted');
      setConfirmDelete(null);
    } catch { toast.error('Could not delete department'); }
  };

  return (
    <div>
      <PageHeader
        title="Departments"
        description="Manage organizational departments, heads, and budgets."
        breadcrumbs={[{ label: 'Home', link: '/ceo/dashboard' }, { label: 'Departments' }]}
        actions={<Button size="sm" icon={Plus} onClick={openNew}>Add department</Button>}
      />

      {loading ? (
        <Card><div className="p-8 text-center text-sm text-gray-500">Loading departments…</div></Card>
      ) : departments.length === 0 ? (
        <Card><EmptyState icon={Building2} title="No departments" description="Add your first department to get started." /></Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((d) => (
            <Card key={d.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-navy-100 dark:bg-navy-800">
                  <Building2 size={20} className="text-navy-600 dark:text-navy-300" />
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(d)} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-navy-600 dark:hover:bg-navy-800" title="Edit"><Pencil size={14} /></button>
                  <button onClick={() => setConfirmDelete(d)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
              <h3 className="mt-3 text-base font-semibold text-navy-900 dark:text-gray-100">{d.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Head: {d.head}</p>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-navy-800">
                <div>
                  <p className="flex items-center gap-1 text-xs text-gray-400"><UsersIcon size={12} /> Members</p>
                  <p className="text-sm font-semibold text-navy-800 dark:text-gray-200">{d.memberCount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Budget</p>
                  <p className="text-sm font-semibold text-navy-800 dark:text-gray-200">{formatCurrency(d.budget)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Avg perf</p>
                  <p className="text-sm font-semibold text-emerald-600">{d.avgPerformance}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit department' : 'Add department'} size="sm"
        footer={<><Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button><Button size="sm" loading={saving} onClick={save}>{editing ? 'Save' : 'Create'}</Button></>}>
        <div className="space-y-4">
          <Input label="Department name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Risk" />
          <Input label="Department head" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} placeholder="e.g. Maya Patel" />
          <Input label="Annual budget ($)" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} placeholder="0" />
        </div>
      </Modal>

      <ConfirmDialog open={Boolean(confirmDelete)} onClose={() => setConfirmDelete(null)} onConfirm={handleDelete}
        title="Delete department?" message={`This will permanently delete the ${confirmDelete?.name} department.`} confirmLabel="Delete" />
    </div>
  );
}
