import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { CalendarRange, Check, X, Eye } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge, { statusTone } from '@/components/common/Badge';
import Avatar from '@/components/common/Avatar';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import Textarea from '@/components/common/Textarea';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { setPlans, updatePlanInList } from '@/redux/slices/planSlice';
import { getPlans, approvePlan, rejectPlan } from '@/services/planService';
import { PLAN_STATUS_LABELS } from '@/constants/statuses';
import { formatDate } from '@/utils/format';

export default function ManagerWeeklyPlans() {
  const dispatch = useAppDispatch();
  const [plans, setLocalPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('submitted');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState('');
  const [acting, setActing] = useState(false);

  useEffect(() => {
    getPlans().then((res) => {
      dispatch(setPlans(res.data));
      setLocalPlans(res.data.items);
      setLoading(false);
    });
  }, [dispatch]);

  const filtered = filter === 'all' ? plans : plans.filter((p) => p.status === filter);

  const approve = async () => {
    setActing(true);
    try {
      const res = await approvePlan(selected.id, { notes });
      dispatch(updatePlanInList(res.data));
      setLocalPlans((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...res.data } : p)));
      toast.success('Plan approved');
      setSelected(null);
      setNotes('');
    } catch {
      toast.error('Could not approve plan');
    } finally {
      setActing(false);
    }
  };

  const reject = async () => {
    setActing(true);
    try {
      const res = await rejectPlan(selected.id, { notes });
      dispatch(updatePlanInList(res.data));
      setLocalPlans((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...res.data } : p)));
      toast.success('Plan rejected');
      setSelected(null);
      setNotes('');
    } catch {
      toast.error('Could not reject plan');
    } finally {
      setActing(false);
    }
  };

  const tabs = [
    { key: 'submitted', label: 'Awaiting review' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div>
      <PageHeader
        title="Weekly Plans"
        description="Review, approve, and reject weekly plans submitted by your team."
        breadcrumbs={[{ label: 'Home', link: '/manager/dashboard' }, { label: 'Weekly Plans' }]}
      />

      <div className="mb-4 flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1 dark:border-navy-800 dark:bg-navy-900">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setFilter(tab.key)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${filter === tab.key ? 'bg-navy-900 text-white dark:bg-navy-700' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-800'}`}>
            {tab.label}
            {tab.key !== 'all' && <span className="ml-1.5 text-xs opacity-60">{plans.filter((p) => p.status === tab.key).length}</span>}
          </button>
        ))}
      </div>

      <Card className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading plans…</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={CalendarRange} title="No plans to show" description="Plans submitted by your team will appear here for review." />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-navy-800">
            {filtered.map((plan) => (
              <div key={plan.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <Avatar name={plan.ownerName} size="sm" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{plan.ownerName}</p>
                      <Badge tone={statusTone(plan.status)} dot>{PLAN_STATUS_LABELS[plan.status]}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{plan.weekLabel} · {plan.goals?.length || 0} goals · {plan.department}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {plan.status === 'submitted' && (
                    <>
                      <Button size="xs" variant="success" icon={Check} onClick={() => { setSelected(plan); setNotes(''); }}>Approve</Button>
                      <Button size="xs" variant="danger" icon={X} onClick={() => { setSelected(plan); setNotes(''); }}>Reject</Button>
                    </>
                  )}
                  <Button size="xs" variant="ghost" icon={Eye} onClick={() => setSelected(plan)}>View</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.weekLabel}
        description={selected ? `${selected.ownerName} · ${selected.department}` : ''}
        size="lg"
        footer={selected?.status === 'submitted' ? (
          <>
            <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Cancel</Button>
            <Button variant="danger" size="sm" icon={X} loading={acting} onClick={reject}>Reject</Button>
            <Button variant="success" size="sm" icon={Check} loading={acting} onClick={approve}>Approve</Button>
          </>
        ) : <Button variant="secondary" size="sm" onClick={() => setSelected(null)}>Close</Button>}
      >
        {selected && (
          <div className="space-y-4">
            <div>
              <h4 className="mb-2 text-sm font-semibold text-navy-900 dark:text-gray-100">Goals</h4>
              <div className="space-y-2">
                {selected.goals?.map((g) => (
                  <div key={g.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-navy-800">
                    <div>
                      <p className="text-sm font-medium text-navy-800 dark:text-gray-200">{g.text}</p>
                      <p className="text-xs text-gray-400">{g.tasks} tasks</p>
                    </div>
                    <Badge tone="navy">{g.weight}%</Badge>
                  </div>
                ))}
              </div>
            </div>
            {selected.reviewNotes && (
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-navy-800/50">
                <p className="text-xs font-semibold text-gray-500">Review notes</p>
                <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{selected.reviewNotes}</p>
              </div>
            )}
            {selected.status === 'submitted' && (
              <Textarea label="Review notes (optional)" placeholder="Add feedback for the employee…" value={notes} onChange={(e) => setNotes(e.target.value)} />
            )}
            <div className="text-xs text-gray-400">
              Submitted {selected.submittedAt ? formatDate(selected.submittedAt) : '—'}
              {selected.reviewedAt && ` · Reviewed ${formatDate(selected.reviewedAt)}`}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
