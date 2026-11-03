import { describe, it, expect } from 'vitest';
import { getPasswordError, PASSWORD_MIN_LENGTH } from '@/lib/utils/password';

describe('getPasswordError', () => {
  it('requires at least 8 characters', () => {
    expect(PASSWORD_MIN_LENGTH).toBe(8);
  });

  it('returns a message for a short password', () => {
    expect(getPasswordError('abc1234')).toBe('Use at least 8 characters.');
  });

  it('returns a message for an empty password', () => {
    expect(getPasswordError('')).toBe('Use at least 8 characters.');
  });

  it('returns nothing for a long enough password', () => {
    expect(getPasswordError('abcd1234')).toBe('');
  });
});