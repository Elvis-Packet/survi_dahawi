import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import PageHeader from '@/components/layout/PageHeader';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';
import Badge from '@/components/common/Badge';
import { useNotifications } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

const typeTone = {
  task_assigned: 'info',
  plan_reviewed: 'success',
  task_overdue: 'danger',
  mention: 'navy',
  task_verified: 'success',
  system: 'neutral',
};

export default function NotificationsPage({ role }) {
  const { notifications, unreadCount, handleMarkRead, handleMarkAllRead } = useNotifications();

  return (
    <div>
      <PageHeader
        title="Notifications"
        description="Stay on top of task updates, plan reviews, and system alerts."
        breadcrumbs={[{ label: 'Home', link: `/${role}/dashboard` }, { label: 'Notifications' }]}
        actions={
          unreadCount > 0 ? (
            <Button variant="secondary" size="sm" icon={CheckCheck} onClick={handleMarkAllRead}>
              Mark all read
            </Button>
          ) : null
        }
      />

      <Card className="divide-y divide-gray-100 p-0 dark:divide-navy-800">
        {notifications.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You're all caught up. New activity will appear here." />
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                'flex items-start gap-3 px-5 py-4 transition hover:bg-gray-50/60 dark:hover:bg-navy-800/40',
                !n.read && 'bg-navy-50/40 dark:bg-navy-800/20'
              )}
            >
              <div className={cn('mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                n.read ? 'bg-gray-100 dark:bg-navy-800' : 'bg-navy-100 dark:bg-navy-700')}>
                <Bell size={16} className={n.read ? 'text-gray-400' : 'text-navy-600 dark:text-navy-200'} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-navy-900 dark:text-gray-100">{n.title}</p>
                  <Badge tone={typeTone[n.type] || 'neutral'}>{n.type.replace(/_/g, ' ')}</Badge>
                  {!n.read && <span className="h-2 w-2 rounded-full bg-navy-500" />}
                </div>
                <p className="mt-0.5 text-sm text-gray-600 dark:text-gray-400">{n.message}</p>
                <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(n.createdAt)}</p>
              </div>
              {!n.read && (
                <button onClick={() => handleMarkRead(n.id)} className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-navy-600 dark:hover:bg-navy-700" title="Mark as read">
                  <CheckCheck size={16} />
                </button>
              )}
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
