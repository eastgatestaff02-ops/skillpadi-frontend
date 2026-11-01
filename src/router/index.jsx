import { lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';
import AppFrame from '@/components/shared/AppFrame';

import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import RegisterVerify from '@/pages/auth/RegisterVerify';
import CompleteRegistration from '@/pages/auth/CompleteRegistration';
import SelectRole from '@/pages/auth/SelectRole';
import PublicProfile from '@/pages/shared/PublicProfile';

const WorkerDashboard = lazy(() => import('@/pages/worker/Dashboard'));
const WorkerProfile = lazy(() => import('@/pages/worker/Profile'));
const JobsSearch = lazy(() => import('@/pages/worker/JobsSearch'));

const EmployerDashboard = lazy(() => import('@/pages/employer/Dashboard'));
const NewJob = lazy(() => import('@/pages/employer/NewJob'));
const SearchWorkers = lazy(() => import('@/pages/employer/SearchWorkers'));

const TrainerDashboard = lazy(() => import('@/pages/trainer/Dashboard'));
const TrainerProfile = lazy(() => import('@/pages/trainer/TrainerProfile'));
const CreateListing = lazy(() => import('@/pages/trainer/CreateListing'));

const ApprenticeListings = lazy(() => import('@/pages/apprentice/Listings'));
const Apply = lazy(() => import('@/pages/apprentice/Apply'));
const MyApplications = lazy(() => import('@/pages/apprentice/MyApplications'));

export const router = createBrowserRouter([
  { path: '/', element: <Navigate to="/auth/login" replace /> },
  { path: '/register', element: <Navigate to="/auth/signup" replace /> },
  { path: '/auth/register', element: <Navigate to="/auth/signup" replace /> },

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
            element: <AppFrame />,
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
                path: '/trainer',
                element: <ProtectedRoute role="worker" />,
                children: [
                  { path: 'dashboard', element: <TrainerDashboard /> },
                  { path: 'profile', element: <TrainerProfile /> },
                  { path: 'listings/new', element: <CreateListing /> },
                ],
              },
              {
                path: '/employer',
                element: <ProtectedRoute role="employer" />,
                children: [
                  { path: 'dashboard', element: <EmployerDashboard /> },
                  { path: 'jobs/new', element: <NewJob /> },
                  { path: 'search', element: <SearchWorkers /> },
                ],
              },
              {
                path: '/apprentice',
                element: <ProtectedRoute role="apprentice" />,
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
    ],
  },

  { path: '*', element: <div className="p-8 text-center text-red-500">404 - Page Not Found</div> },
]);