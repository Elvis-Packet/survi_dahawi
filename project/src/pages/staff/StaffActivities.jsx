import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListTodo, ArrowRight, CheckCircle2, Clock, Circle } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Badge, { statusTone } from '@/components/common/Badge';
import EmptyState from '@/components/common/EmptyState';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setTasks } from '@/redux/slices/taskSlice';
import { getTasks } from '@/services/taskService';
import { formatRelativeTime, formatDate } from '@/utils/format';
import { ROUTES } from '@/constants/routes';

const iconFor = (type) => {
  const m = { task_completed: CheckCircle2, task_assigned: ListTodo, plan_submitted: Clock, plan_approved: CheckCircle2, plan_rejected: Clock };
  return m[type] || Circle;
};

export default function StaffActivities() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const { tasks } = useAppSelector((s) => s.task);
  const { recentActivities } = useAppSelector((s) => s.dashboard);

  useEffect(() => {
    getTasks({ assigneeId: user?.id }).then((res) => dispatch(setTasks(res.data)));
  }, [dispatch, user?.id]);

  return (
    <div>
      <PageHeader
        title="Activities"
        description="A timeline of your recent work and task updates."
        breadcrumbs={[{ label: 'Home', link: '/staff/dashboard' }, { label: 'Activities' }]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-navy-900 dark:text-gray-100">Activity timeline</h3>
          <div className="relative space-y-4 before:absolute before:left-[15px] before:top-2 before:h-full before:w-px before:bg-gray-200 dark:before:bg-navy-700">
            {recentActivities.length === 0 ? (
              <EmptyState icon={ListTodo} title="No activity yet" />
            ) : recentActivities.map((a) => {
              const Icon = iconFor(a.type);
              return (
                <div key={a.id} className="relative flex gap-3 pl-0">
                  <div className="z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gray-100 dark:border-navy-900 dark:bg-navy-800">
                    <Icon size={14} className="text-gray-500 dark:text-gray-300" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-sm text-navy-800 dark:text-gray-200">{a.text}</p>
                    <p className="text-xs text-gray-400">{a.actor} · {formatRelativeTime(a.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="mb-3 text-sm font-semibold text-navy-900 dark:text-gray-100">Task history</h3>
          <div className="space-y-2">
            {tasks.slice(0, 6).map((t) => (
              <Link key={t.id} to={ROUTES.STAFF_TASKS} className="block rounded-lg border border-gray-100 p-3 transition hover:border-navy-200 dark:border-navy-800 dark:hover:border-navy-700">
                <p className="truncate text-sm font-medium text-navy-900 dark:text-gray-100">{t.title}</p>
                <div className="mt-1 flex items-center justify-between">
                  <Badge tone={statusTone(t.status)} dot>{t.status.replace(/_/g, ' ')}</Badge>
                  <span className="text-xs text-gray-400">{formatDate(t.dueDate)}</span>
                </div>
              </Link>
            ))}
          </div>
          <Link to={ROUTES.STAFF_TASKS}>
            <button className="mt-3 flex w-full items-center justify-center gap-1 text-xs font-medium text-navy-600 hover:text-navy-800 dark:text-navy-300">
              View all tasks <ArrowRight size={13} />
            </button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
