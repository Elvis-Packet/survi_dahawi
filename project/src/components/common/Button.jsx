import { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { Loader2 } from 'lucide-react';

const variants = {
  primary:
    'bg-navy-900 text-white hover:bg-navy-800 active:bg-navy-950 shadow-sm dark:bg-navy-700 dark:hover:bg-navy-600',
  secondary:
    'bg-white text-navy-900 border border-gray-300 hover:bg-gray-50 dark:bg-navy-800 dark:text-gray-100 dark:border-navy-700 dark:hover:bg-navy-700',
  outline:
    'bg-transparent text-navy-700 border border-navy-200 hover:bg-navy-50 dark:text-navy-200 dark:border-navy-700 dark:hover:bg-navy-800',
  ghost:
    'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-navy-800',
  success:
    'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 shadow-sm',
  danger:
    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
  warning:
    'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700 shadow-sm',
  subtle:
    'bg-navy-50 text-navy-700 hover:bg-navy-100 dark:bg-navy-800 dark:text-navy-200 dark:hover:bg-navy-700',
};

const sizes = {
  xs: 'h-7 px-2.5 text-xs gap-1.5',
  sm: 'h-8 px-3 text-sm gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
};

const Button = forwardRef(function Button(
  {
    children, variant = 'primary', size = 'md', loading = false,
    disabled = false, icon: Icon, iconRight: IconRight,
    className, type = 'button', ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-navy-950 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : Icon ? <Icon size={size === 'xs' ? 14 : 16} /> : null}
      {children}
      {IconRight && !loading ? <IconRight size={size === 'xs' ? 14 : 16} /> : null}
    </button>
  );
});

export default Button;
