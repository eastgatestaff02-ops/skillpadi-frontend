
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import {
  LogOut,
  Home,
  User,
  Briefcase,
  Search,
  GraduationCap
} from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const isWorkerOrTrainer =
    user?.role === 'worker' || user?.role === 'trainer';

  const isActive = (path) =>
    location.pathname.includes(path)
      ? 'bg-teal-50 text-teal-700'
      : 'text-gray-700 hover:bg-teal-50';

  const dashboardPath = `/${user?.role}/dashboard`;

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <Link
            to={dashboardPath}
            className="text-xl md:text-2xl font-bold text-teal-700"
          >
            SkillPadi
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {user?.firstName || user?.phone}
            </span>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>

        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex">

        {/* Desktop Sidebar */}
        <aside className="hidden md:flex flex-col w-64 min-h-[calc(100vh-65px)] bg-white border-r p-4">

          <nav className="space-y-2">

            <Link
              to={dashboardPath}
              className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('dashboard')}`}
            >
              <Home size={20} />
              Dashboard
            </Link>

            {isWorkerOrTrainer ? (
              <>
                <Link
                  to="/worker/profile"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/worker/profile')}`}
                >
                  <User size={20} />
                  My Profile
                </Link>

                <Link
                  to="/worker/jobs"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/worker/jobs')}`}
                >
                  <Briefcase size={20} />
                  Find Jobs
                </Link>

                <Link
                  to="/worker/training"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/worker/training')}`}
                >
                  <GraduationCap size={20} />
                  My Apprentices
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/employer/search"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/employer/search')}`}
                >
                  <Search size={20} />
                  Find Workers
                </Link>

                <Link
                  to="/employer/jobs/create"
                  className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/employer/jobs/create')}`}
                >
                  <Briefcase size={20} />
                  Post a Job
                </Link>
              </>
            )}

          </nav>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>

      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">

        <div className="flex justify-around items-center py-3">

          <Link
            to={dashboardPath}
            className={`flex flex-col items-center text-xs gap-1 ${isActive('dashboard')}`}
          >
            <Home size={20} />
            Home
          </Link>

          {isWorkerOrTrainer ? (
            <>
              <Link
                to="/worker/jobs"
                className={`flex flex-col items-center text-xs gap-1 ${isActive('/worker/jobs')}`}
              >
                <Briefcase size={20} />
                Jobs
              </Link>

              <Link
                to="/worker/training"
                className={`flex flex-col items-center text-xs gap-1 ${isActive('/worker/training')}`}
              >
                <GraduationCap size={20} />
                Train
              </Link>

              <Link
                to="/worker/profile"
                className={`flex flex-col items-center text-xs gap-1 ${isActive('/worker/profile')}`}
              >
                <User size={20} />
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/employer/search"
                className={`flex flex-col items-center text-xs gap-1 ${isActive('/employer/search')}`}
              >
                <Search size={20} />
                Search
              </Link>

              <Link
                to="/employer/jobs/create"
                className={`flex flex-col items-center text-xs gap-1 ${isActive('/employer/jobs/create')}`}
              >
                <Briefcase size={20} />
                Post
              </Link>
            </>
          )}

        </div>
      </nav>

    </div>
  );
}
