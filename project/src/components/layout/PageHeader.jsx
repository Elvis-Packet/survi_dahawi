import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function PageHeader({ title, description, breadcrumbs = [], actions }) {
  return (
    <div className="mb-6">
      {breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {crumb.link ? (
                <Link to={crumb.link} className="transition hover:text-navy-700 dark:hover:text-gray-200">
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-medium text-navy-800 dark:text-gray-200">{crumb.label}</span>
              )}
              {i < breadcrumbs.length - 1 && <ChevronRight size={13} className="text-gray-300" />}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-navy-900 dark:text-gray-100 sm:text-2xl">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
