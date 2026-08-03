import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Hexagon } from 'lucide-react';
import { getNavForRole } from '@/constants/navigation';
import { ROLE_LABELS } from '@/constants/roles';
import { cn } from '@/utils/cn';

export default function Sidebar({ role, open, onClose }) {
  const items = getNavForRole(role);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-30 bg-navy-950/50 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-300 lg:translate-x-0 dark:border-navy-800 dark:bg-navy-900',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand */}
        <div className="flex h-16 items-center justify-between gap-2 border-b border-gray-200 px-5 dark:border-navy-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-900 text-white dark:bg-navy-700">
              <Hexagon size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-navy-900 dark:text-gray-100">SurvitechDahawi</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-400">Fintech Suite</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-gray-400 hover:bg-gray-100 lg:hidden dark:hover:bg-navy-800" aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {ROLE_LABELS[role]} Workspace
          </p>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-navy-900 text-white shadow-sm dark:bg-navy-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-navy-900 dark:text-gray-300 dark:hover:bg-navy-800 dark:hover:text-gray-100'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={18} className={cn(isActive ? 'text-white' : 'text-gray-400 group-hover:text-navy-700 dark:group-hover:text-gray-200')} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-200 px-5 py-4 dark:border-navy-800">
          <p className="text-[10px] text-gray-400">SurvitechDahawi v1.0.0 · MVP</p>
          <p className="text-[10px] text-gray-400">© 2026 SurvitechDahawi</p>
        </div>
      </aside>
    </>
  );
}
