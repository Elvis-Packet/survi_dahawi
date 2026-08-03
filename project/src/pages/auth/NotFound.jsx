import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';
import Button from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6 text-center dark:bg-navy-950">
      <div className="max-w-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-navy-100 dark:bg-navy-800">
          <Compass size={30} className="text-navy-600 dark:text-navy-300" />
        </div>
        <p className="text-sm font-semibold uppercase tracking-wide text-navy-600">404</p>
        <h1 className="mt-1 text-2xl font-bold text-navy-900 dark:text-gray-100">Page not found</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link to={ROUTES.LOGIN} className="mt-6 inline-block">
          <Button icon={ArrowLeft}>Back to sign in</Button>
        </Link>
      </div>
    </div>
  );
}
