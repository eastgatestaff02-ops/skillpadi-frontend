import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';

export default function GuestRoute() {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) return <Outlet />;

  return <Navigate to={user?.role ? `/${user.role}/dashboard` : '/auth/select-role'} replace />;
}