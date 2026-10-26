import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import RegisterVerify from '@/pages/auth/RegisterVerify';
import CompleteRegistration from '@/pages/auth/CompleteRegistration';
import SelectRole from '@/pages/auth/SelectRole';

import WorkerProfile from '@/pages/worker/Profile';
import SearchWorkers from '@/pages/employer/SearchWorkers';
import PublicProfile from '@/pages/shared/PublicProfile';

import EmployerDashboard from '@/pages/employer/Dashboard';
import NewJob from '@/pages/employer/NewJob';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/auth/login" replace />,
  },

  { path: '/auth/login', element: <Login /> },
  { path: '/auth/signup', element: <Signup /> },
  { path: '/auth/register/verify', element: <RegisterVerify /> },
  { path: '/auth/register/complete', element: <CompleteRegistration /> },
  { path: '/auth/select-role', element: <SelectRole /> },

  { path: '/profile/:id', element: <PublicProfile /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/worker',
        element: <ProtectedRoute role="worker" />,
        children: [
          { path: 'profile', element: <WorkerProfile /> },
        ],
      },

      {
        path: '/employer',
        element: <ProtectedRoute role="employer" />,
        children: [
          { path: 'search', element: <SearchWorkers /> },
          { path: 'dashboard', element: <EmployerDashboard /> },
          { path: 'jobs/new', element: <NewJob /> },
        ],
      },
    ],
  },

  { path: '*', element: <div className="p-8 text-center text-red-500">404 - Page Not Found</div> },
]);