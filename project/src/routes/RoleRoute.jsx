import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/useAppDispatch';
import { ROUTES } from '@/constants/routes';

export default function RoleRoute({ allowedRoles, children }) {
  const role = useAppSelector((s) => s.auth.user?.role);
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }
  return children;
}
