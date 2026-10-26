import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppFrame from '@/components/shared/AppFrame';

import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import RegisterVerify from '@/pages/auth/RegisterVerify';
import CompleteRegistration from '@/pages/auth/CompleteRegistration';
import SelectRole from '@/pages/auth/SelectRole';

import WorkerProfile from '@/pages/worker/Profile';
import SearchWorkers from '@/pages/employer/SearchWorkers';
import PublicProfile from '@/pages/shared/PublicProfile';

const EmployerDashboard = lazy(() => import('@/pages/employer/Dashboard'));
const NewJob = lazy(() => import('@/pages/employer/NewJob'));

const TrainerDashboard = lazy(() => import('@/pages/trainer/Dashboard'));
const TrainerProfile = lazy(() => import('@/pages/trainer/TrainerProfile'));
const CreateListing = lazy(() => import('@/pages/trainer/CreateListing'));

const ApprenticeListings = lazy(() => import('@/pages/apprentice/Listings'));
const Apply = lazy(() => import('@/pages/apprentice/Apply'));
const MyApplications = lazy(() => import('@/pages/apprentice/MyApplications'));

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
          {
            element: <AppFrame />,
            children: [
              { path: 'search', element: <SearchWorkers /> },
              { path: 'dashboard', element: <EmployerDashboard /> },
              { path: 'jobs/new', element: <NewJob /> },
            ],
          },
        ],
      },

      {
        path: '/trainer',
        element: <ProtectedRoute role="worker" />,
        children: [
          {
            element: <AppFrame />,
            children: [
              { path: 'dashboard', element: <TrainerDashboard /> },
              { path: 'profile', element: <TrainerProfile /> },
              { path: 'listings/new', element: <CreateListing /> },
            ],
          },
        ],
      },

      {
        path: '/apprentice',
        element: <ProtectedRoute role="apprentice" />,
        children: [
          {
            element: <AppFrame />,
            children: [
              { path: 'dashboard', element: <Navigate to="/apprentice/listings" replace /> },
              { path: 'listings', element: <ApprenticeListings /> },
              { path: 'listings/:id/apply', element: <Apply /> },
              { path: 'applications', element: <MyApplications /> },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <div className="p-8 text-center text-red-500">404 - Page Not Found</div> },
]);