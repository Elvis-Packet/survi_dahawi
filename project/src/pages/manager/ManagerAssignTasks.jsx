import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserPlus, Send } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import DatePicker from '@/components/forms/DatePicker';
import Badge from '@/components/common/Badge';
import { getUsers } from '@/services/userService';
import { createTask } from '@/services/taskService';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { addTask } from '@/redux/slices/taskSlice';
import { MOCK_DEPARTMENTS } from '@/data/departments';

export default function ManagerAssignTasks() {
  const dispatch = useAppDispatch();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState([]);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    getUsers({ role: 'staff' }).then((res) => setEmployees(res.data.items));
  }, []);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const assignee = employees.find((e) => e.id === data.assigneeId);
      const payload = { ...data, assigneeName: assignee?.name, assignerName: 'Jordan Lee', assignerId: 'usr_010', department: assignee?.department };
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
                  <p className="truncate text-sm font-medium text-navy-900 dark:text-gray-100">{t.title}</p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t.assigneeName}</span>
                    <Badge tone="info">{t.priority}</Badge>
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
