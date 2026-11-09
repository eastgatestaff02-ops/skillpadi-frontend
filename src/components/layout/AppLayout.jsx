import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import { LogOut, Home, User, Briefcase, Search, GraduationCap } from 'lucide-react';

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isWorkerOrTrainer = user?.role === 'worker' || user?.role === 'trainer';

  const isActive = (path) => location.pathname.includes(path) 
    ? 'bg-teal-50 text-teal-700' 
    : 'text-gray-700 hover:bg-teal-50';

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link to={`/${user?.role}/dashboard`} className="text-xl md:text-2xl font-bold text-teal-700">SkillPadi</Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600 hidden md:block">{user?.firstName || user?.phone}</span>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500 flex items-center gap-1 text-sm">
            <LogOut size={16} /> <span className="hidden md:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="flex flex-1 w-full max-w-7xl mx-auto">
        {/* Desktop Sidebar */}
        <aside className="w-64 bg-white border-r hidden md:block p-4">
          <nav className="space-y-2">
            <Link to={`/${user?.role}/dashboard`} className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('dashboard')}`}>
              <Home size={20} /> Dashboard
            </Link>
            
            {isWorkerOrTrainer ? (
              <>
                <Link to="/worker/profile" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/worker/profile')}`}>
                  <User size={20} /> My Profile
                </Link>
                <Link to="/worker/jobs" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/worker/jobs')}`}>
                  <Briefcase size={20} /> Find Jobs
                </Link>
                <Link to="/worker/training" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/worker/training')}`}>
                  <GraduationCap size={20} /> My Apprentices
                </Link>
              </>
            ) : (
              <>
                <Link to="/employer/search" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/employer/search')}`}>
                  <Search size={20} /> Find Workers
                </Link>
                <Link to="/employer/jobs/new" className={`flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive('/employer/jobs/new')}`}>
                  <Briefcase size={20} /> Post a Job
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 w-full overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 w-full bg-white border-t md:hidden flex justify-around py-3 z-50">
        <Link to={`/${user?.role}/dashboard`} className={`flex flex-col items-center text-xs gap-1 ${isActive('dashboard')}`}>
          <Home size={20} /> Home
        </Link>
        
        {isWorkerOrTrainer ? (
          <>
            <Link to="/worker/jobs" className={`flex flex-col items-center text-xs gap-1 ${isActive('/worker/jobs')}`}>
              <Search size={20} /> Jobs
            </Link>
            <Link to="/worker/training" className={`flex flex-col items-center text-xs gap-1 ${isActive('/worker/training')}`}>
              <GraduationCap size={20} /> Train
            </Link>
            <Link to="/worker/profile" className={`flex flex-col items-center text-xs gap-1 ${isActive('/worker/profile')}`}>
              <User size={20} /> Profile
            </Link>
          </>
        ) : (
          <>
            <Link to="/employer/search" className={`flex flex-col items-center text-xs gap-1 ${isActive('/employer/search')}`}>
              <Search size={20} /> Search
            </Link>
            <Link to="/employer/jobs/new" className={`flex flex-col items-center text-xs gap-1 ${isActive('/employer/jobs/new')}`}>
              <Briefcase size={20} /> Post
            </Link>
          </>
        )}
      </div>
    </div>
  );
}