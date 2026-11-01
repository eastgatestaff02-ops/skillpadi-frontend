import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import {
  LogOut,
  Home,
  User,
  Briefcase,
  Search,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';

const navByRole = {
  worker: [
    { to: '/worker/dashboard', label: 'Dashboard', icon: Home },
    { to: '/worker/profile', label: 'My Profile', icon: User },
    { to: '/worker/jobs', label: 'Find Jobs', icon: Briefcase },
    { to: '/trainer/dashboard', label: 'Training', icon: GraduationCap },
  ],
  employer: [
    { to: '/employer/dashboard', label: 'Dashboard', icon: Home },
    { to: '/employer/jobs/new', label: 'Post a Job', icon: Briefcase },
    { to: '/employer/search', label: 'Find Workers', icon: Search },
  ],
  apprentice: [
    { to: '/apprentice/listings', label: 'Apprenticeships', icon: GraduationCap },
    { to: '/apprentice/applications', label: 'My Applications', icon: ClipboardList },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = navByRole[user?.role] || [];
  const homePath = links.length > 0 ? links[0].to : '/auth/select-role';

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4 shadow-sm">
        <Link to={homePath} className="text-2xl font-bold tracking-tight text-teal-700">
          SkillPadi
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-600">
            {user?.firstName || user?.name || user?.phone || 'User'}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-white p-4 md:block">
          <nav className="space-y-2">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-lg p-3 font-medium text-gray-700 hover:bg-teal-50"
              >
                <Icon size={20} /> {label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 pb-20 md:pb-6">
          <Outlet />
        </main>
      </div>

      <div className="fixed bottom-0 z-50 flex w-full justify-around border-t bg-white p-3 md:hidden">
        {links.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center text-xs text-gray-600 hover:text-teal-600"
          >
            <Icon size={20} className="mb-1" /> {label}
          </Link>
        ))}
      </div>
    </div>
  );
}