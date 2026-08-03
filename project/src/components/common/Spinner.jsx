import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Spinner({ size = 24, className, label }) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2 text-navy-500', className)} role="status" aria-label={label || 'Loading'}>
      <Loader2 size={size} className="animate-spin" />
      {label && <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>}
    </div>
  );
}
