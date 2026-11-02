import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store/authStore';
import {
  Home,
  User,
  Briefcase,
  Search,
  GraduationCap,
  ClipboardList,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import Button from '@/components/ui/Button';

const navByRole = {
  worker: [
    { to: '/worker/dashboard', label: 'Home', icon: Home },
    { to: '/worker/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/worker/profile', label: 'Profile', icon: User },
    { to: '/trainer/dashboard', label: 'Training', icon: GraduationCap },
  ],
  employer: [
    { to: '/employer/dashboard', label: 'Home', icon: Home },
    { to: '/employer/jobs/new', label: 'Post job', icon: PlusCircle },
    { to: '/employer/search', label: 'Find workers', icon: Search },
  ],
  apprentice: [
    { to: '/apprentice/listings', label: 'Learn', icon: GraduationCap },
    { to: '/apprentice/applications', label: 'Applications', icon: ClipboardList },
  ],
};

export default function AppLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const links = navByRole[user?.role] || [];
  const homePath = links.length > 0 ? links[0].to : '/auth/select-role';
  const displayName = user?.firstName || user?.name || user?.phone;

  const handleLogout = () => {
    logout();
    navigate('/auth/sign-in');
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <header className="sticky top-0 z-20 border-b border-navy-50 bg-cream">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link to={homePath} className="text-h3 font-bold text-navy-500">
            SkillPadi
          </Link>
          <div className="flex items-center gap-3">
            {displayName && (
              <span className="hidden text-body2 text-navy-500/70 sm:inline">{displayName}</span>
            )}
            <Button variant="text" size="sm" leftIcon={LogOut} onClick={handleLogout}>
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pb-28">
        <Outlet />
      </main>

      {links.length > 0 && (
        <nav
          aria-label="Main"
          className="fixed inset-x-0 bottom-0 z-30 bg-navy-500"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="mx-auto flex max-w-5xl">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex flex-1 flex-col items-center gap-1 py-2.5 text-caption font-medium transition-colors ${
                    isActive ? 'text-ochre-500' : 'text-white/70 hover:text-white'
                  }`
                }
              >
                <Icon size={22} />
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}