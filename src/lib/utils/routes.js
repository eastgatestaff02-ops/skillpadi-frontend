export function homePathFor(user, mode) {
  if (!user?.role) return '/auth/select-role';
  if (user.role === 'worker' && mode === 'trainer') return '/trainer/dashboard';
  return `/${user.role}/dashboard`;
}