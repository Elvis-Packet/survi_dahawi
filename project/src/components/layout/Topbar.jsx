import { Menu, Search, Moon, Sun } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import ProfileDropdown from './ProfileDropdown';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { useTheme } from '@/hooks/useTheme';
import { markRead, markAllRead } from '@/redux/slices/notificationSlice';
import { markNotificationRead, markAllNotificationsRead } from '@/services/notificationService';

export default function Topbar({ onMenuClick }) {
  const dispatch = useAppDispatch();
  const unreadCount = useAppSelector((s) => s.notification.unreadCount);
  const notifications = useAppSelector((s) => s.notification.notifications);
  const { theme, toggleTheme } = useTheme();

  const handleMarkRead = async (id) => {
    dispatch(markRead(id));
    try { await markNotificationRead(id); } catch {}
  };
  const handleMarkAllRead = async () => {
    dispatch(markAllRead());
    try { await markAllNotificationsRead(); } catch {}
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/80 px-4 backdrop-blur-md lg:px-6 dark:border-navy-800 dark:bg-navy-900/80">
      <button
        onClick={onMenuClick}
        className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 lg:hidden dark:text-gray-400 dark:hover:bg-navy-800"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative hidden flex-1 max-w-md md:block">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search tasks, plans, people…"
          className="input-base h-9 pl-9"
        />
      </div>

      <div className="flex flex-1 items-center justify-end gap-1.5 md:flex-none">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-navy-900 dark:text-gray-400 dark:hover:bg-navy-800 dark:hover:text-gray-100"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <NotificationDropdown
          notifications={notifications}
          unreadCount={unreadCount}
          onMarkAllRead={handleMarkAllRead}
          onMarkRead={handleMarkRead}
        />

        <div className="mx-1 h-6 w-px bg-gray-200 dark:bg-navy-700" />

        <ProfileDropdown />
      </div>
    </header>
  );
}
