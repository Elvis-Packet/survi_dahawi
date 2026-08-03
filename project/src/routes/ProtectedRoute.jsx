import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { ROUTES } from '@/constants/routes';

export default function ProtectedRoute({ children }) {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  return children;
}
