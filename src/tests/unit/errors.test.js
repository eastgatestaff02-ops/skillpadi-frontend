import { describe, it, expect } from 'vitest';
import { getApiErrorMessage } from '@/lib/utils/errors';

const apiError = (error) => ({ response: { data: { error } } });

describe('getApiErrorMessage', () => {
  it('says the server could not be reached when there is no response', () => {
    expect(getApiErrorMessage(undefined)).toBe(
      'We could not reach the server. Check your connection and try again.'
    );
  });

  it('explains rate limiting', () => {
    expect(getApiErrorMessage(apiError({ code: 'RATE_LIMITED' }))).toBe(
      'Too many attempts. Please wait a moment and try again.'
    );
  });

  it('shows the field messages from the backend', () => {
    expect(
      getApiErrorMessage(
        apiError({
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: [
            { path: 'password', message: 'Too short.' },
            { path: 'title', message: 'Required.' },
          ],
        })
      )
    ).toBe('Too short. Required.');
  });

  it('uses the backend message when there are no field messages', () => {
    expect(getApiErrorMessage(apiError({ message: 'Invalid credentials' }))).toBe(
      'Invalid credentials'
    );
    expect(getApiErrorMessage(apiError({ message: 'Invalid request', details: [] }))).toBe(
      'Invalid request'
    );
  });

  it('falls back to the text you pass in', () => {
    expect(getApiErrorMessage({ response: { data: {} } }, 'Fallback text')).toBe('Fallback text');
  });
});