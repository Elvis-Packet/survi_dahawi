import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ClipboardCheck, Check, X, ShieldCheck } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import Textarea from '@/components/common/Textarea';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setTasks, updateTaskInList } from '@/redux/slices/taskSlice';
import { getTasks, verifyTask } from '@/services/taskService';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function ManagerVerification() {
  const dispatch = useAppDispatch();
  const { tasks } = useAppSelector((s) => s.task);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [acting, setActing] = useState(false);
  const [tab, setTab] = useState('pending');

  useEffect(() => {
    getTasks().then((res) => {
      dispatch(setTasks(res.data));
      setLoading(false);
    });
  }, [dispatch]);

  const completed = tasks.filter((t) => t.status === 'completed' && !t.verified);
  const verified = tasks.filter((t) => t.verified);
  const list = tab === 'pending' ? completed : verified;

  const verify = async (approved) => {
    setActing(true);
    try {
      const res = await verifyTask(selected.id, { approved, notes });
      dispatch(updateTaskInList(res.data));
      toast.success(approved ? 'Task verified' : 'Verification rejected');
      setSelected(null);
      setNotes('');
    } catch {
      toast.error('Could not verify task');
    } finally {
      setActing(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Verification"
        description="Review completed tasks and verify or reject them."
        breadcrumbs={[{ label: 'Home', link: '/manager/dashboard' }, { label: 'Verification' }]}
      />

      <div className="mb-4 flex gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-navy-800 dark:bg-navy-900">
        {[['pending', `Pending verification (${completed.length})`], ['verified', `Verified (${verified.length})`]].map(([k, label]) => (
          <button key={k} onClick={() => setTab(k)}
            className={cn('rounded-md px-3 py-1.5 text-sm font-medium transition',
              tab === k ? 'bg-navy-900 text-white dark:bg-navy-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-800')}>
            {label}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading…</div>
        ) : list.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title={tab === 'pending' ? 'No tasks awaiting verification' : 'No verified tasks yet'} description={tab === 'pending' ? 'Completed tasks will appear here for your review.' : 'Verified tasks will be listed here.'} />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-navy-800">
            {list.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={task.assigneeName} size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{task.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{task.assigneeName} · {task.department} · Due {formatDate(task.dueDate)}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {task.verified ? (
                    <Badge tone="success" dot><ShieldCheck size={11} className="mr-0.5" /> Verified</Badge>
                  ) : (
                    <>
                      <Button size="xs" variant="success" icon={Check} onClick={() => { setSelected(task); setNotes(''); }}>Verify</Button>
                      <Button size="xs" variant="danger" icon={X} onClick={() => { setSelected(task); setNotes(''); }}>Reject</Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title="Verify task"
        description={selected?.title}
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
            <Button variant="danger" size="sm" icon={X} loading={acting} onClick={() => verify(false)}>Reject</Button>
            <Button variant="success" size="sm" icon={Check} loading={acting} onClick={() => verify(true)}>Approve & verify</Button>
          </>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-800/50">
              <p className="text-xs font-semibold text-gray-500">Description</p>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{selected.description}</p>
            </div>
            <Textarea label="Verification notes (optional)" placeholder="Add feedback or reasons for your decision…" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        )}
      </Modal>
    </div>
  );
}
