import { cn } from '@/utils/cn';

const alignMap = { left: 'text-left', center: 'text-center', right: 'text-right' };

export default function DataTable({
  columns, data, onRowClick, emptyState,
  sortable = true, sortKey, sortDir, onSort,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-navy-800">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400',
                  alignMap[col.align] || 'text-left',
                  col.className
                )}
              >
                {sortable && col.sortable !== false ? (
                  <button
                    onClick={() => onSort?.(col.key)}
                    className="inline-flex items-center gap-1 transition hover:text-navy-700 dark:hover:text-gray-200"
                  >
                    {col.label}
                    <SortIcon active={sortKey === col.key} dir={sortDir} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8">
                {emptyState || <p className="text-center text-sm text-gray-500">No data available</p>}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id || row.key}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn(
                  'border-b border-gray-100 transition last:border-0 dark:border-navy-800/60',
                  onRowClick && 'cursor-pointer hover:bg-gray-50 dark:hover:bg-navy-800/50'
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 text-navy-800 dark:text-gray-200', alignMap[col.align] || 'text-left', col.bodyClassName)}
                  >
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, dir }) {
  if (!active) return <span className="text-gray-300">↕</span>;
  return <span className="text-navy-600">{dir === 'asc' ? '↑' : '↓'}</span>;
}
