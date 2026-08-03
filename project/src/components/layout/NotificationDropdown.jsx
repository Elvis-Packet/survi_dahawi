import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';
import Dropdown, { DropdownItem, DropdownDivider, DropdownLabel } from '@/components/common/Dropdown';
import { formatRelativeTime } from '@/utils/format';
import { cn } from '@/utils/cn';

export default function NotificationDropdown({ notifications, unreadCount, onMarkAllRead, onMarkRead }) {
  return (
    <Dropdown
      align="right"
      width="w-80"
      trigger={
        <button className="relative rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-navy-900 dark:text-gray-400 dark:hover:bg-navy-800 dark:hover:text-gray-100" aria-label="Notifications">
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      }
    >
      <div className="flex items-center justify-between px-3 py-2">
        <DropdownLabel>Notifications</DropdownLabel>
        {unreadCount > 0 && (
          <button onClick={onMarkAllRead} className="text-xs font-medium text-navy-600 hover:text-navy-800 dark:text-navy-300 dark:hover:text-navy-100">
            Mark all read
          </button>
        )}
      </div>
      <DropdownDivider />
      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <p className="px-3 py-6 text-center text-sm text-gray-500">You're all caught up</p>
        ) : (
          notifications.slice(0, 6).map((n) => (
            <div
              key={n.id}
              onClick={() => !n.read && onMarkRead(n.id)}
              className={cn(
                'flex gap-3 px-3 py-2.5 transition hover:bg-gray-50 dark:hover:bg-navy-800/60',
                !n.read && 'bg-navy-50/50 dark:bg-navy-800/30'
              )}
            >
              <div className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.read ? 'bg-transparent' : 'bg-navy-500')} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-navy-900 dark:text-gray-100">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
                <p className="mt-1 text-[10px] text-gray-400">{formatRelativeTime(n.createdAt)}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <DropdownDivider />
      <Link to="/staff/notifications" onClick={(e) => e.stopPropagation()}>
        <DropdownItem>View all notifications</DropdownItem>
      </Link>
    </Dropdown>
  );
}
