import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CheckSquare, ChevronRight, Flag, MessageSquarePlus } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import StatusBadge from '@/components/common/StatusBadge';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import Textarea from '@/components/common/Textarea';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setTasks, updateTaskInList } from '@/redux/slices/taskSlice';
import { getTasks, updateTaskProgress, markTaskComplete, addTaskComment } from '@/services/taskService';
import { PRIORITY_LABELS } from '@/constants/statuses';
import { formatDate } from '@/utils/format';
import { cn } from '@/utils/cn';

const priorityTone = { low: 'neutral', medium: 'info', high: 'warning', critical: 'danger' };

export default function StaffTasks() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { tasks } = useAppSelector((s) => s.task);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [progressValue, setProgressValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    getTasks({ assigneeId: user?.id }).then((res) => {
      dispatch(setTasks(res.data));
      setLoading(false);
    });
  }, [dispatch, user?.id]);

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter);

  const openTask = (task) => {
    setSelected(task);
    setProgressValue(task.progress || 0);
    setCommentDraft('');
  };

  const saveComment = async () => {
    if (!commentDraft.trim() || !selected) return;
    setCommenting(true);
    try {
      const res = await addTaskComment(selected.id, {
        authorId: user?.id,
        authorName: user?.name,
        message: commentDraft.trim(),
      });
      const updated = { ...selected, comments: res.data.comments || [] };
      dispatch(updateTaskInList(updated));
      setSelected(updated);
      setCommentDraft('');
      toast.success('Comment added');
    } catch {
      toast.error('Could not add comment');
    } finally {
      setCommenting(false);
    }
  };

  const saveProgress = async () => {
    setSaving(true);
    try {
      const res = await updateTaskProgress(selected.id, progressValue);
      const status = progressValue >= 100 ? 'completed' : progressValue > 0 ? 'in_progress' : selected.status;
      const updated = { ...res.data, status };
      dispatch(updateTaskInList(updated));
      setSelected(updated);
      toast.success('Progress updated');
    } catch {
      toast.error('Could not update progress');
    } finally {
      setSaving(false);
    }
  };

  const completeTask = async (task) => {
    try {
      const res = await markTaskComplete(task.id);
      dispatch(updateTaskInList(res.data));
      if (selected?.id === task.id) setSelected({ ...task, status: 'completed', progress: 100 });
      toast.success('Task marked complete');
    } catch {
      toast.error('Could not complete task');
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'in_progress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
    { key: 'overdue', label: 'Overdue' },
  ];

  return (
    <div>
      <PageHeader
        title="Assigned Tasks"
        description="Track progress, update status, and mark tasks complete."
        breadcrumbs={[{ label: 'Home', link: '/staff/dashboard' }, { label: 'Assigned Tasks' }]}
      />

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-navy-800 dark:bg-navy-900">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition',
              filter === tab.key
                ? 'bg-navy-900 text-white dark:bg-navy-700'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-800'
            )}
          >
            {tab.label}
            {tab.key !== 'all' && (
              <span className="ml-1.5 text-xs opacity-60">{tasks.filter((t) => t.status === tab.key).length}</span>
            )}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading tasks…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={CheckSquare} title="No tasks here" description="Tasks assigned to you will appear in this list." />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-navy-800">
            {filtered.map((task) => (
              <div key={task.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                <button onClick={() => openTask(task)} className="min-w-0 flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-navy-900 dark:text-gray-100">{task.title}</p>
                    <Badge tone={priorityTone[task.priority]}><Flag size={10} className="mr-0.5" />{PRIORITY_LABELS[task.priority]}</Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-gray-400">{task.description}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <StatusBadge status={task.status} />
                    <span className="text-xs text-gray-400">Due {formatDate(task.dueDate)}</span>
                    <span className="text-xs text-gray-400">· {task.department}</span>
                  </div>
                </button>
                <div className="flex shrink-0 items-center gap-3">
                  <div className="w-28">
                    <div className="mb-1 flex justify-between text-xs text-gray-500">
                      <span>Progress</span><span>{task.progress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-navy-700">
                      <div className={cn('h-full rounded-full', task.progress >= 100 ? 'bg-emerald-500' : 'bg-navy-600')} style={{ width: `${task.progress}%` }} />
                    </div>
                  </div>
                  {task.status !== 'completed' && task.status !== 'verified' && (
                    <Button size="xs" variant="success" onClick={() => completeTask(task)}>Complete</Button>
                  )}
                  <button onClick={() => openTask(task)} className="rounded-md p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-navy-800">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Task detail modal */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.title}
        description={selected?.department}
        size="lg"
        footer={
          selected && selected.status !== 'completed' && selected.status !== 'verified' ? (
            <>
              <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Button>
              <Button variant="success" size="sm" onClick={() => completeTask(selected)}>Mark complete</Button>
            </>
          ) : <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Button>
        }
      >
        {selected && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={selected.status} />
              <Badge tone={priorityTone[selected.priority]}>Priority: {PRIORITY_LABELS[selected.priority]}</Badge>
              {selected.verified && <Badge tone="success" dot>Verified</Badge>}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">{selected.description}</p>
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <Info label="Assigned by" value={selected.assignerName} />
              <Info label="Due date" value={formatDate(selected.dueDate)} />
              <Info label="Created" value={formatDate(selected.createdAt)} />
              <Info label="Tags" value={selected.tags?.join(', ') || '—'} />
            </div>

            <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-800">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-navy-800 dark:text-gray-200">
                <MessageSquarePlus size={15} />
                Task comments
              </div>
              <div className="space-y-2">
                {(selected.comments || []).length === 0 ? (
                  <p className="text-xs text-gray-500 dark:text-gray-400">No comments yet.</p>
                ) : (
                  (selected.comments || []).map((comment) => (
                    <div key={comment.id} className="rounded-lg bg-gray-50 p-3 text-xs dark:bg-navy-800/60">
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-semibold text-navy-900 dark:text-gray-100">{comment.authorName || 'Commenter'}</span>
                        <span className="text-gray-400">{formatDate(comment.createdAt)}</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300">{comment.message}</p>
                    </div>
                  ))
                )}
              </div>

              {(user?.role === 'manager' || user?.role === 'ceo') && (
                <div className="mt-3 space-y-2">
                  <Textarea
                    label="Add comment"
                    rows={2}
                    placeholder="Leave a review note or update for the assignee…"
                    value={commentDraft}
                    onChange={(e) => setCommentDraft(e.target.value)}
                  />
                  <Button size="sm" loading={commenting} onClick={saveComment}>Add comment</Button>
                </div>
              )}
            </div>

            {selected.status !== 'completed' && selected.status !== 'verified' && (
              <div className="rounded-lg border border-gray-200 p-4 dark:border-navy-800">
                <label className="mb-2 block text-sm font-medium text-navy-800 dark:text-gray-200">Update progress: {progressValue}%</label>
                <input
                  type="range" min="0" max="100" value={progressValue}
                  onChange={(e) => setProgressValue(Number(e.target.value))}
                  className="w-full accent-navy-600"
                />
                <Button size="sm" className="mt-3" loading={saving} onClick={saveProgress}>Save progress</Button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="font-medium text-navy-800 dark:text-gray-200">{value}</p>
    </div>
  );
}
