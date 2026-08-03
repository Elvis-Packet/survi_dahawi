import { cn } from '@/utils/cn';

const tones = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-navy-800 dark:text-gray-300',
  navy: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
};

const dots = {
  neutral: 'bg-gray-400',
  navy: 'bg-navy-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
  info: 'bg-sky-500',
};

export default function Badge({ children, tone = 'neutral', dot = false, className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone], className
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dots[tone])} />}
      {children}
    </span>
  );
}

export const statusTone = (status) => {
  const map = {
    pending: 'warning',
    in_progress: 'info',
    completed: 'success',
    verified: 'success',
    approved: 'success',
    rejected: 'danger',
    overdue: 'danger',
    draft: 'neutral',
    submitted: 'info',
    active: 'success',
    suspended: 'danger',
    published: 'success',
  };
  return map[status] || 'neutral';
};
