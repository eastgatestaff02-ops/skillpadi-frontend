import { describe, it, expect } from 'vitest';
import { unwrapList } from '@/lib/utils/api';

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