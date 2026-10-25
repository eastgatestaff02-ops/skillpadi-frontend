import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';

export default function ProtectedRoute({ role }) {
  const { token, user } = useAuthStore();

  // 1. If no token, kick them to login
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. If a specific role is required (e.g., 'worker') and they don't have it, block them
  if (role && user?.role !== role) {
    // Optional: Redirect them to their correct dashboard instead
    return <Navigate to={`/${user?.role}/dashboard`} replace />;
  }

  // 3. Otherwise, render the child routes (the requested page)
  return <Outlet />;
}