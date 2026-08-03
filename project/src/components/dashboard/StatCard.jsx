import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { formatCompact } from '@/utils/format';

export default function StatCard({ icon: Icon, label, value, change, trend = 'up', tone = 'navy', index = 0, prefix = '', suffix = '' }) {
  const toneStyles = {
    navy: 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    info: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  };

  const displayValue = typeof value === 'number' ? `${prefix}${formatCompact(value)}${suffix}` : `${prefix}${value}${suffix}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      className="card p-5"
    >
      <div className="flex items-start justify-between">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-lg', toneStyles[tone])}>
          {Icon && <Icon size={20} />}
        </div>
        {change != null && (
          <span className={cn(
            'inline-flex items-center gap-0.5 text-xs font-semibold',
            trend === 'up' ? 'text-emerald-600' : 'text-red-600'
          )}>
            {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {change}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tracking-tight text-navy-900 dark:text-gray-100">{displayValue}</p>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">{label}</p>
    </motion.div>
  );
}
