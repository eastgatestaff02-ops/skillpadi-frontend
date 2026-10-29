import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/shared/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Signup from '../pages/auth/Signup';
import RegisterVerify from '../pages/auth/RegisterVerify';
import CompleteRegistration from '../pages/auth/CompleteRegistration';
import SelectRole from '../pages/auth/SelectRole';

// Worker & Employer Pages
import WorkerProfile from '../pages/worker/Profile';
import WorkerDashboard from '../pages/worker/Dashboard';
import JobsSearch from '../pages/worker/JobsSearch';
import SearchWorkers from '../pages/employer/SearchWorkers';
import NewJob from '../pages/employer/NewJob';
import PublicProfile from '../pages/shared/PublicProfile';

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/auth/login" replace /> },
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
        element: <AppLayout />,
        children: [
          {
            path: '/worker',
            element: <ProtectedRoute role="worker" />,
            children: [
              { path: 'dashboard', element: <WorkerDashboard /> },
              { path: 'profile', element: <WorkerProfile /> },
              { path: 'jobs', element: <JobsSearch /> },
            ],
          },
          {
            path: '/employer',
            element: <ProtectedRoute role="employer" />,
            children: [
              { path: 'dashboard', element: <NewJob /> }, // Temporarily pointing to NewJob so it doesn't crash looking for a missing dashboard
              { path: 'search', element: <SearchWorkers /> },
              { path: 'jobs/new', element: <NewJob /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <div className="p-8 text-center text-red-500">404 - Not Found</div> },
]);