import { describe, it, expect } from 'vitest';
import { homePathFor } from '@/lib/utils/routes';

describe('homePathFor', () => {
  it('sends users without a role to role selection', () => {
    expect(homePathFor(null, null)).toBe('/auth/select-role');
    expect(homePathFor({}, null)).toBe('/auth/select-role');
  });

  it('sends a trainer to the trainer dashboard', () => {
    expect(homePathFor({ role: 'worker' }, 'trainer')).toBe('/trainer/dashboard');
  });

  it('sends everyone else to their role dashboard', () => {
    expect(homePathFor({ role: 'worker' }, 'worker')).toBe('/worker/dashboard');
    expect(homePathFor({ role: 'employer' }, null)).toBe('/employer/dashboard');
  });
});