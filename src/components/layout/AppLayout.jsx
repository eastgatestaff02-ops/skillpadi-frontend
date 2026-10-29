import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import { LogOut, Home, User, Briefcase, Search } from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const isWorker = user?.role === 'worker';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <Link to={`/${user?.role}/dashboard`} className="text-2xl font-bold text-teal-700 tracking-tight">SkillPadi</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">{user?.firstName || user?.phone || 'User'}</span>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:block p-4">
          <nav className="space-y-2">
            <Link to={`/${user?.role}/dashboard`} className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 font-medium">
              <Home size={20} /> Dashboard
            </Link>
            {isWorker ? (
              <>
                <Link to="/worker/profile" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 font-medium">
                  <User size={20} /> My Profile
                </Link>
                <Link to="/worker/jobs" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 font-medium">
                  <Briefcase size={20} /> Find Jobs
                </Link>
              </>
            ) : (
              <>
                <Link to="/employer/jobs/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 font-medium">
                  <Briefcase size={20} /> Post a Job
                </Link>
                <Link to="/employer/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-teal-50 text-gray-700 font-medium">
                  <Search size={20} /> Find Workers
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}