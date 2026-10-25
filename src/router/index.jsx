import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

// --- AUTH PAGES ---
import Login from '@/pages/auth/Login';
import Signup from '@/pages/auth/Signup';
import RegisterVerify from '@/pages/auth/RegisterVerify';
import CompleteRegistration from '@/pages/auth/CompleteRegistration';
import SelectRole from '@/pages/auth/SelectRole';

// --- DEV A PAGES (The ones you just built) ---
import WorkerProfile from '@/pages/worker/Profile';
import SearchWorkers from '@/pages/employer/SearchWorkers';
import PublicProfile from '@/pages/shared/PublicProfile';

// --- OTHER PLACEHOLDER PAGES (Import these as you build them) ---
// import WorkerDashboard from '@/pages/worker/Dashboard';
// import EmployerDashboard from '@/pages/employer/Dashboard';

export const router = createBrowserRouter([
  // 1. Default Route: Redirect to login
  { 
    path: '/', 
    element: <Navigate to="/auth/login" replace /> 
  },

  // 2. Public Auth Routes
  { path: '/auth/login', element: <Login /> },
  { path: '/auth/signup', element: <Signup /> },
  { path: '/auth/register/verify', element: <RegisterVerify /> },
  { path: '/auth/register/complete', element: <CompleteRegistration /> },
  { path: '/auth/select-role', element: <SelectRole /> },

  // 3. Public Profile (Employers need to see this without a specific role lock)
  { path: '/profile/:id', element: <PublicProfile /> },

  // 4. Protected Routes (Must be logged in)
  {
    element: <ProtectedRoute />, // Wrapper component checking for token
    children: [
      // Worker Routes
      {
        path: '/worker',
        element: <ProtectedRoute role="worker" />,
        children: [
          { path: 'profile', element: <WorkerProfile /> },
          // { path: 'dashboard', element: <WorkerDashboard /> },
        ],
      },
      
      // Employer Routes
      {
        path: '/employer',
        element: <ProtectedRoute role="employer" />,
        children: [
          { path: 'search', element: <SearchWorkers /> },
          // { path: 'dashboard', element: <EmployerDashboard /> },
        ],
      },
    ],
  },

  // 5. Catch-all for 404s
  { path: '*', element: <div className="p-8 text-center text-red-500">404 - Page Not Found</div> },
]);