import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';

export default function Unauthorized() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-navy-950">
      <div className="max-w-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40">
          <ShieldAlert size={30} className="text-amber-600 dark:text-amber-400" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-600">403</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900 dark:text-gray-100">Access denied</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          You don't have permission to view this page. If you believe this is an error, contact your administrator.
        </p>
        <Link to={ROUTES.LOGIN} className="mt-6 inline-block">
          <Button icon={ArrowLeft}>Back to sign in</Button>
        </Link>
      </div>
    </div>
  );
}
