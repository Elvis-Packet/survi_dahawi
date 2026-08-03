import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserPlus, Send, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import DatePicker from '@/components/forms/DatePicker';
import Badge from '@/components/common/Badge';
import { getUsers } from '@/services/userService';
import { createTask, deleteTask, getTasks } from '@/services/taskService';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { addTask, removeTask } from '@/redux/slices/taskSlice';
import { MOCK_DEPARTMENTS } from '@/data/departments';

export default function ManagerAssignTasks() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    getUsers({ role: 'staff' }).then((res) => setEmployees(res.data.items));
    getTasks({ assignerId: user?.id }).then((res) => setRecent(res.data.items.slice(0, 5)));
  }, [user?.id]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const assignee = employees.find((e) => e.id === data.assigneeId);
      const payload = {
        ...data,
        assigneeName: assignee?.name,
        assignerName: user?.name,
        assignerId: user?.id,
        department: assignee?.department,
        tags: Array.isArray(data.tags) ? data.tags : String(data.tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      };
      const res = await createTask(payload);
      dispatch(addTask(res.data));
      setRecent((prev) => [res.data, ...prev].slice(0, 5));
      toast.success(`Task assigned to ${assignee?.name}`);
      reset();
    } catch {
      toast.error('Could not assign task');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecent = async (taskId) => {
    try {
      await deleteTask(taskId);
      dispatch(removeTask(taskId));
      setRecent((prev) => prev.filter((t) => t.id !== taskId));
      toast.success('Task removed');
    } catch {
      toast.error('Could not remove task');
    }
  };

  return (
    <div>
      <PageHeader
        title="Assign Tasks"
        description="Create and assign tasks to team members with priorities and deadlines."
        breadcrumbs={[{ label: 'Home', link: '/manager/dashboard' }, { label: 'Assign Tasks' }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">New task assignment</h3>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">Fill in the details below. The assignee will be notified.</p>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
            <Input label="Task title" placeholder="e.g. Reconcile Q3 settlements" error={errors.title?.message} {...register('title', { required: 'Title is required' })} />
            <Textarea label="Description" placeholder="Describe the task and expected outcome…" rows={3} {...register('description', { required: 'Description is required' })} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select label="Assign to" placeholder="Select employee" error={errors.assigneeId?.message}
                options={employees.map((e) => ({ value: e.id, label: `${e.name} — ${e.department}` }))}
                {...register('assigneeId', { required: 'Select an employee' })} />
              <Select label="Department" placeholder="Select department"
                options={MOCK_DEPARTMENTS.filter((d) => d.id !== 'dep_00').map((d) => ({ value: d.name, label: d.name }))}
                {...register('department')} />
              <Select label="Priority" placeholder="Select priority"
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
                {...register('priority', { required: true })} />
              <DatePicker label="Due date" {...register('dueDate', { required: 'Due date is required' })} />
            </div>

            <Input label="Tags (comma separated)" placeholder="e.g. payments, reconciliation" {...register('tags')} />

            <div className="flex justify-end pt-2">
              <Button type="submit" icon={Send} loading={loading}>Assign task</Button>
            </div>
          </form>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Recently assigned</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No tasks assigned yet in this session.</p>
          ) : (
            <div className="space-y-2">
              {recent.map((t) => (
                <div key={t.id} className="rounded-lg border border-gray-100 p-3 dark:border-navy-800">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-navy-900 dark:text-gray-100">{t.title}</p>
                      <div className="mt-1 flex items-center justify-between gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.assigneeName}</span>
                        <Badge tone="info">{t.priority}</Badge>
                      </div>
                    </div>
                    <button onClick={() => handleRemoveRecent(t.id)} className="rounded-md p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Remove task">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
