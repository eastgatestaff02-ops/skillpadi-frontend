import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import { homePathFor } from '@/lib/utils/routes';

export default function GuestRoute() {
  const { accessToken, user, mode } = useAuthStore();

  if (!accessToken) return <Outlet />;

  return <Navigate to={homePathFor(user, mode)} replace />;
}