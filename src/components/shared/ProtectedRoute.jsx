import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProtectedRoute({ role }) {
  const { accessToken, user } = useAuthStore();

  if (!accessToken) {
    return <Navigate to="/auth/login" replace />;
  }

  if (role && user?.role !== role) {
    // Prevent infinite loops if the user doesn't have a role yet
    if (!user?.role) return <Navigate to="/auth/select-role" replace />;
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
}