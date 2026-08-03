import { initials as getInitials } from '@/utils/format';
import { cn } from '@/utils/cn';

const sizes = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
};

export default function Avatar({ name = '', src, size = 'md', color, className, ring = false }) {
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white overflow-hidden',
        sizes[size],
        !src && (color || 'bg-navy-600'),
        ring && 'ring-2 ring-white dark:ring-navy-900',
        className
      )}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="h-full w-full object-cover" />
      ) : (
        getInitials(name)
      )}
    </div>
  );
}
