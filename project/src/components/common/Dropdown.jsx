import { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

export default function Dropdown({ trigger, children, align = 'right', width = 'w-56', className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute z-40 mt-2 rounded-lg border border-gray-200 bg-white py-1.5 shadow-elevated animate-slide-down dark:border-navy-700 dark:bg-navy-900',
            width,
            align === 'right' ? 'right-0' : 'left-0',
            className
          )}
          onClick={() => setOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({ children, onClick, icon: Icon, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition',
        danger ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/30' : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-navy-800'
      )}
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-gray-200 dark:bg-navy-800" />;
}

export function DropdownLabel({ children }) {
  return <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">{children}</div>;
}
