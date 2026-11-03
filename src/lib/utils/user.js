const ROLE_PRIORITY = ['EMPLOYER', 'WORKER', 'APPRENTICE'];

export function normalizeUser(user) {
  if (!user) return null;
  const roles = Array.isArray(user.roles) ? user.roles.map((role) => String(role).toUpperCase()) : [];
  const primary = ROLE_PRIORITY.find((role) => roles.includes(role));
  return { ...user, roles, role: primary ? primary.toLowerCase() : null };
}