import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import ProtectedRoute from '@/components/shared/ProtectedRoute';
import GuestRoute from '@/components/shared/GuestRoute';
import AppLayout from '@/components/layout/AppLayout';
import AppFrame from '@/components/shared/AppFrame';

import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import ForgotPin from '@/pages/auth/ForgotPin';
import Privacy from '@/pages/shared/Privacy';
import RegisterVerify from '@/pages/auth/RegisterVerify';
import CreatePin from '@/pages/auth/CreatePin';
import SelectRole from '@/pages/auth/SelectRole';
import PublicProfile from '@/pages/shared/PublicProfile';
import NotFound from '@/pages/shared/NotFound';

// Worker Pages
const WorkerDashboard = lazy(() => import('@/pages/worker/Dashboard'));
const WorkerProfile = lazy(() => import('@/pages/worker/Profile'));
const JobsSearch = lazy(() => import('@/pages/worker/JobsSearch'));

// Trainer Pages
const TrainerDashboard = lazy(() => import('@/pages/trainer/Dashboard'));
const TrainerProfile = lazy(() => import('@/pages/trainer/TrainerProfile'));
const CreateListing = lazy(() => import('@/pages/trainer/CreateListing'));

// Employer Pages
const EmployerDashboard = lazy(() => import('@/pages/employer/Dashboard'));
const NewJob = lazy(() => import('@/pages/employer/NewJob'));
const JobDetail = lazy(() => import('@/pages/employer/JobDetail'));
const SearchWorkers = lazy(() => import('@/pages/employer/SearchWorkers'));
const EmployerProfile = lazy(() => import('@/pages/employer/Profile')); // ADDED

// Apprentice Pages
const ApprenticeDashboard = lazy(() => import('@/pages/apprentice/Dashboard'));
const ApprenticeListings = lazy(() => import('@/pages/apprentice/Listings'));
const Apply = lazy(() => import('@/pages/apprentice/Apply'));
const MyApplications = lazy(() => import('@/pages/apprentice/MyApplications'));

// Developer Pages
const Preview = lazy(() => import('@/pages/dev/Preview'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <p className="text-teal-700 font-medium">Loading SkillPadi...</p>
  </div>
);

const devRoutes = import.meta.env.DEV
  ? [
      {
        path: '/dev/preview',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Preview />
          </Suspense>
        ),
      },
    ]
  : [];

export const router = createBrowserRouter([
  // Public Routes
  { path: '/', element: <Navigate to="/auth/sign-in" replace /> },
  { path: '/register', element: <Navigate to="/auth/sign-up" replace /> },
  { path: '/auth/forgot-pin', element: <ForgotPin /> },
  { path: '/auth/register', element: <Navigate to="/auth/sign-up" replace /> },
  { path: '/auth/create-pin', element: <CreatePin /> },
  { path: '/auth/register/complete', element: <Navigate to="/auth/sign-up" replace /> },
  { path: '/auth/login', element: <Navigate to="/auth/sign-in" replace /> },
  { path: '/auth/signup', element: <Navigate to="/auth/sign-up" replace /> },

  // Guest Routes
  {
    element: <GuestRoute />,
    children: [
      { path: '/auth/sign-in', element: <Login /> },
      { path: '/auth/sign-up', element: <Signup /> },
    ],
  },

  // Authentication and Shared Routes
  { path: '/auth/register/verify', element: <RegisterVerify /> },
  { path: '/auth/select-role', element: <SelectRole /> },
  { path: '/profile/:id', element: <PublicProfile /> },
  { path: '/privacy', element: <Privacy /> },

  ...devRoutes,

  // Protected Application Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: (
              <Suspense fallback={<PageLoader />}>
                <AppFrame />
              </Suspense>
            ),
            children: [

              // WORKER ROUTES
              {
                path: '/worker',
                element: <ProtectedRoute role="worker" />,
                children: [
                  { path: 'dashboard', element: <WorkerDashboard /> },
                  { path: 'profile', element: <WorkerProfile /> },
                  { path: 'jobs', element: <JobsSearch /> },
                  
                  // Redirect for sidebar link
                  { path: 'training', element: <Navigate to="/worker/training/dashboard" replace /> },
                  
                  // Trainer Pages nested under Worker
                  { path: 'training/dashboard', element: <TrainerDashboard /> },
                  { path: 'training/profile', element: <TrainerProfile /> },
                  { path: 'training/listings/new', element: <CreateListing /> },
                ],
              },

              // EMPLOYER ROUTES
              {
                path: '/employer',
                element: <ProtectedRoute role="employer" />,
                children: [
                  { path: 'dashboard', element: <EmployerDashboard /> },
                  { path: 'profile', element: <EmployerProfile /> }, // ADDED
                  { path: 'jobs/new', element: <NewJob /> },
                  { path: 'jobs/:id', element: <JobDetail /> },
                  { path: 'search', element: <SearchWorkers /> },
                ],
              },

              // APPRENTICE ROUTES
              {
                path: '/apprentice',
                element: <ProtectedRoute role="apprentice" />,
                children: [
                  { path: 'dashboard', element: <ApprenticeDashboard /> },
                  { path: 'training', element: <ApprenticeListings /> }, // CHANGED
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

  // 404 Page
  { path: '*', element: <NotFound /> },
]);