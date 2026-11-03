import { describe, it, expect } from 'vitest';
import { parseIdentifier, identifierPayload, formatIdentifier } from '@/lib/utils/identifier';

describe('parseIdentifier', () => {
  it('recognises a phone number and normalises it', () => {
    expect(parseIdentifier('0803 456 7890')).toEqual({
      type: 'phone',
      value: '+2348034567890',
    });
  });

  it('recognises an email, trims it and lowercases it', () => {
    expect(parseIdentifier('  Ada@Example.COM ')).toEqual({
      type: 'email',
      value: 'ada@example.com',
    });
  });

  it('rejects an incomplete email', () => {
    expect(parseIdentifier('ada@')).toBeNull();
    expect(parseIdentifier('ada@example')).toBeNull();
  });

  it('rejects a short phone number', () => {
    expect(parseIdentifier('12345')).toBeNull();
  });

  it('rejects empty input', () => {
    expect(parseIdentifier('')).toBeNull();
  });
});

describe('identifierPayload', () => {
  it('sends a phone number under the phone key', () => {
    expect(identifierPayload({ type: 'phone', value: '+2348034567890' })).toEqual({
      phone: '+2348034567890',
    });
  });

  it('sends an email under the email key', () => {
    expect(identifierPayload({ type: 'email', value: 'ada@example.com' })).toEqual({
      email: 'ada@example.com',
    });
  });
});

describe('formatIdentifier', () => {
  it('formats a phone number for display', () => {
    expect(formatIdentifier({ type: 'phone', value: '+2348034567890' })).toBe(
      '+234 803 456 7890'
    );
  });

  it('leaves an email as it is', () => {
    expect(formatIdentifier({ type: 'email', value: 'ada@example.com' })).toBe('ada@example.com');
  });
});