import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppDispatch';
import { setNotifications } from '@/redux/slices/notificationSlice';
import { getNotifications } from '@/services/notificationService';

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const role = useAppSelector((s) => s.auth.user?.role);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getNotifications().then((res) => dispatch(setNotifications(res.data))).catch(() => {});
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950">
      <Sidebar role={role} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-4 py-6 lg:px-8 lg:py-8">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="mx-auto max-w-7xl"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
