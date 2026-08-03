import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function Pagination({ page, totalPages, onPageChange, pageSize, onPageSizeChange, total }) {
  if (totalPages <= 0) return null;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-4 py-3 sm:flex-row dark:border-navy-800">
      <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {total > 0 ? `${from}–${to} of ${total}` : 'No results'}
        </span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-md border border-gray-300 bg-white px-1.5 py-1 text-xs dark:bg-navy-800 dark:border-navy-700"
          >
            {[8, 12, 20, 50].map((n) => (
              <option key={n} value={n}>{n} / page</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center gap-1">
        <PageBtn disabled={page === 1} onClick={() => onPageChange(1)} aria-label="First page">
          <ChevronsLeft size={16} />
        </PageBtn>
        <PageBtn disabled={page === 1} onClick={() => onPageChange(page - 1)} aria-label="Previous page">
          <ChevronLeft size={16} />
        </PageBtn>
        <span className="px-3 text-xs font-medium text-navy-800 dark:text-gray-200">
          {page} / {totalPages}
        </span>
        <PageBtn disabled={page === totalPages} onClick={() => onPageChange(page + 1)} aria-label="Next page">
          <ChevronRight size={16} />
        </PageBtn>
        <PageBtn disabled={page === totalPages} onClick={() => onPageChange(totalPages)} aria-label="Last page">
          <ChevronsRight size={16} />
        </PageBtn>
      </div>
    </div>
  );
}

function PageBtn({ children, disabled, onClick, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 transition hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-40 dark:border-navy-700 dark:text-gray-300 dark:hover:bg-navy-800'
      )}
      {...props}
    >
      {children}
    </button>
  );
}
