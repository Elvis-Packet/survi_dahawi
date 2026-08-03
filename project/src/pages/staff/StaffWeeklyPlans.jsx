import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Plus, Trash2, Save, Send, CalendarRange } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Badge, { statusTone } from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import Modal from '@/components/common/Modal';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setPlans, addPlan, updatePlanInList, removePlan } from '@/redux/slices/planSlice';
import { getPlans, createPlan, updatePlan, submitPlan, deletePlan } from '@/services/planService';
import { PLAN_STATUS_LABELS } from '@/constants/statuses';
import { formatDate, formatRelativeTime } from '@/utils/format';

export default function StaffWeeklyPlans() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { plans } = useAppSelector((s) => s.plan);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  useEffect(() => {
    getPlans({ ownerId: user?.id }).then((res) => {
      dispatch(setPlans(res.data));
      setLoading(false);
    });
  }, [dispatch, user?.id]);

  const goals = watch('goals') || [];

  const openNew = () => {
    setEditing(null);
    reset({ weekLabel: `Week 33, 2026`, weekStart: '', weekEnd: '', goals: [{ text: '', tasks: 1, weight: 100 }] });
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    setEditing(plan);
    reset({ ...plan, goals: plan.goals || [{ text: '', tasks: 1, weight: 100 }] });
    setModalOpen(true);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editing) {
        const res = await updatePlan(editing.id, data);
        dispatch(updatePlanInList(res.data));
        toast.success('Plan updated');
      } else {
        const res = await createPlan({ ...data, ownerId: user?.id, ownerName: user?.name, department: user?.department, status: 'draft' });
        dispatch(addPlan(res.data));
        toast.success('Plan saved as draft');
      }
      setModalOpen(false);
    } catch {
      toast.error('Could not save plan');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitPlan = async (plan) => {
    try {
      const res = await submitPlan(plan.id);
      dispatch(updatePlanInList(res.data));
      toast.success('Plan submitted for review');
    } catch {
      toast.error('Could not submit plan');
    }
  };

  const handleDelete = async () => {
    try {
      await deletePlan(confirmDelete.id);
      dispatch(removePlan(confirmDelete.id));
      toast.success('Plan deleted');
      setConfirmDelete(null);
    } catch {
      toast.error('Could not delete plan');
    }
  };

  const addGoal = () => setValue('goals', [...goals, { text: '', tasks: 1, weight: 10 }]);
  const removeGoal = (i) => setValue('goals', goals.filter((_, idx) => idx !== i));

  return (
    <div>
      <PageHeader
        title="Weekly Plans"
        description="Plan your week, save drafts, and submit for manager review."
        breadcrumbs={[{ label: 'Home', link: '/staff/dashboard' }, { label: 'Weekly Plans' }]}
        actions={<Button size="sm" icon={Plus} onClick={openNew}>New plan</Button>}
      />

      <Card className="p-0">
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500">Loading plans…</div>
        ) : plans.length === 0 ? (
          <EmptyState icon={CalendarRange} title="No weekly plans yet" description="Create your first weekly plan to get started." action={<Button size="sm" icon={Plus} onClick={openNew}>New plan</Button>} />
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-navy-800">
            {plans.map((plan) => (
              <div key={plan.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">{plan.weekLabel}</h3>
                    <Badge tone={statusTone(plan.status)} dot>{PLAN_STATUS_LABELS[plan.status]}</Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {plan.goals?.length || 0} goals · {formatDate(plan.weekStart)} – {formatDate(plan.weekEnd)}
                    {plan.reviewerName && ` · Reviewed by ${plan.reviewerName}`}
                  </p>
                  {plan.reviewNotes && <p className="mt-1 text-xs italic text-gray-500 dark:text-gray-400">"{plan.reviewNotes}"</p>}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {plan.status === 'draft' && (
                    <>
                      <Button size="xs" variant="secondary" onClick={() => openEdit(plan)}>Edit</Button>
                      <Button size="xs" icon={Send} onClick={() => handleSubmitPlan(plan)}>Submit</Button>
                    </>
                  )}
                  {plan.status === 'submitted' && <span className="text-xs text-gray-400">Awaiting review</span>}
                  {(plan.status === 'approved' || plan.status === 'rejected') && (
                    <Button size="xs" variant="ghost" onClick={() => openEdit(plan)}>View</Button>
                  )}
                  <button onClick={() => setConfirmDelete(plan)} className="rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30" title="Delete">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Create/Edit modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit weekly plan' : 'New weekly plan'}
        description="Define your goals and deliverables for the week."
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button size="sm" icon={Save} loading={submitting} onClick={handleSubmit(onSubmit)}>
              {editing ? 'Save changes' : 'Save draft'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Week label" {...register('weekLabel', { required: true })} />
            <Input label="Week start" type="date" {...register('weekStart')} />
            <Input label="Week end" type="date" {...register('weekEnd')} />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-navy-800 dark:text-gray-200">Goals</label>
              <Button type="button" size="xs" variant="subtle" icon={Plus} onClick={addGoal}>Add goal</Button>
            </div>
            <div className="space-y-3">
              {goals.map((_, i) => (
                <div key={i} className="flex gap-2 rounded-lg border border-gray-200 p-3 dark:border-navy-800">
                  <div className="flex-1">
                    <Input label="Goal description" placeholder="e.g. Complete Q3 reconciliation" {...register(`goals.${i}.text`)} />
                  </div>
                  <div className="w-24">
                    <Input label="Tasks" type="number" min="1" {...register(`goals.${i}.tasks`)} />
                  </div>
                  <div className="w-24">
                    <Input label="Weight %" type="number" min="0" max="100" {...register(`goals.${i}.weight`)} />
                  </div>
                  <button type="button" onClick={() => removeGoal(i)} className="mt-7 rounded-md p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30">
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {confirmDelete && (
        <ConfirmDelete open onConfirm={handleDelete} onClose={() => setConfirmDelete(null)} plan={confirmDelete} />
      )}
    </div>
  );
}

function ConfirmDelete({ open, onConfirm, onClose, plan }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-xl bg-white p-5 shadow-elevated dark:bg-navy-900">
        <h3 className="text-sm font-semibold text-navy-900 dark:text-gray-100">Delete plan?</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">This will permanently delete "{plan.weekLabel}". This action cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant="danger" size="sm" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}
