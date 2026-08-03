import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import {
  setNotifications, markRead, markAllRead, setNotificationStatus,
} from '@/redux/slices/notificationSlice';
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
} from '@/services/notificationService';

export function useNotifications() {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, status } = useAppSelector((s) => s.notification);

  useEffect(() => {
    let active = true;
    dispatch(setNotificationStatus('loading'));
    getNotifications()
      .then((res) => active && dispatch(setNotifications(res.data)))
      .catch(() => active && dispatch(setNotificationStatus('failed')));
    return () => { active = false; };
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    dispatch(markRead(id));
    try { await markNotificationRead(id); } catch {}
  };

  const handleMarkAllRead = async () => {
    dispatch(markAllRead());
    try { await markAllNotificationsRead(); } catch {}
  };

  return { notifications, unreadCount, status, handleMarkRead, handleMarkAllRead };
}
