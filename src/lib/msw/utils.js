export const DEMO_EMPLOYER = {
  id: 'employer-1',
  name: 'Demo Employer',
  phone: '+2348000000010',
};

export const DEMO_TRAINER = {
  id: 'trainer-1',
  name: 'Demo Trainer',
  phone: '+2348000000011',
};

export const DEMO_APPRENTICE = {
  id: 'apprentice-1',
  name: 'Demo Apprentice',
  phone: '+2348000000012',
};

export function getCurrentUser(demoUser) {
  try {
    const raw = localStorage.getItem('skillpadi-auth');
    const stored = raw ? JSON.parse(raw)?.state?.user : null;
    return {
      ...demoUser,
      name: stored?.name || demoUser.name,
      phone: stored?.phone || demoUser.phone,
    };
  } catch {
    return demoUser;
  }
}