import { describe, it, expect } from 'vitest';
import { normalizeNigerianPhone, formatNigerianPhone } from '@/lib/utils/phone';

describe('normalizeNigerianPhone', () => {
  it('keeps a number that already starts with +234', () => {
    expect(normalizeNigerianPhone('+2348034567890')).toBe('+2348034567890');
  });

  it('adds the plus to a number that starts with 234', () => {
    expect(normalizeNigerianPhone('2348034567890')).toBe('+2348034567890');
  });

  it('replaces a leading zero with +234', () => {
    expect(normalizeNigerianPhone('08034567890')).toBe('+2348034567890');
  });

  it('accepts ten digits with no prefix', () => {
    expect(normalizeNigerianPhone('8034567890')).toBe('+2348034567890');
  });

  it('ignores spaces and dashes', () => {
    expect(normalizeNigerianPhone('+234 803 456 7890')).toBe('+2348034567890');
    expect(normalizeNigerianPhone('0803-456-7890')).toBe('+2348034567890');
  });

  it('rejects numbers with the wrong number of digits', () => {
    expect(normalizeNigerianPhone('0803456789')).toBeNull();
    expect(normalizeNigerianPhone('080345678901')).toBeNull();
  });

  it('rejects text and empty input', () => {
    expect(normalizeNigerianPhone('abc')).toBeNull();
    expect(normalizeNigerianPhone('')).toBeNull();
    expect(normalizeNigerianPhone(null)).toBeNull();
  });
});

describe('formatNigerianPhone', () => {
  it('groups the digits for display', () => {
    expect(formatNigerianPhone('+2348034567890')).toBe('+234 803 456 7890');
  });

  it('returns other text unchanged and empty input as an empty string', () => {
    expect(formatNigerianPhone('abc')).toBe('abc');
    expect(formatNigerianPhone(undefined)).toBe('');
  });
});