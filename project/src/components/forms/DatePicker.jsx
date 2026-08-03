import { forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/utils/cn';

const DatePicker = forwardRef(function DatePicker(
  { label, error, className, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-navy-800 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative">
        <Calendar size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          ref={ref}
          type="date"
          id={inputId}
          className={cn('input-base pl-9', error && 'border-red-500', className)}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
});

export default DatePicker;
