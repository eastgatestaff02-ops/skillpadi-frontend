import { describe, it, expect } from 'vitest';
import { unwrapList, unwrapData } from '@/lib/utils/api';

describe('unwrapList', () => {
  it('returns a bare list as it is', () => {
    expect(unwrapList([1, 2])).toEqual([1, 2]);
  });

  it('opens the data envelope', () => {
    expect(unwrapList({ data: [1] })).toEqual([1]);
  });

  it('returns an empty list when data is not a list', () => {
    expect(unwrapList({ data: {} })).toEqual([]);
  });

  it('returns an empty list for nothing', () => {
    expect(unwrapList(null)).toEqual([]);
    expect(unwrapList(undefined)).toEqual([]);
  });
});

describe('unwrapData', () => {
  it('opens the data envelope', () => {
    expect(unwrapData({ data: { a: 1 } })).toEqual({ a: 1 });
  });

  it('returns a plain object as it is', () => {
    expect(unwrapData({ access_token: 'x' })).toEqual({ access_token: 'x' });
  });

  it('handles nothing', () => {
    expect(unwrapData(undefined)).toBeUndefined();
  });
});