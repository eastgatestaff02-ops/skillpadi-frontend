import { apiClient } from './client';

export const PRIVACY_NOTICE_VERSION = '2026-10-29-v1';

const toLocalPhone = (value) => {
  const text = String(value || '');
  return text.startsWith('+234') ? `0${text.slice(4)}` : text;
};

export const authApi = {
  requestOtp: ({ phone }) =>
    apiClient.post('/api/auth/register/otp/request', {
      phone: toLocalPhone(phone),
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      privacyNoticeAcknowledged: true,
    }),
  verifyOtp: ({ phone, code }) =>
    apiClient.post('/api/auth/register/otp/verify', { phone: toLocalPhone(phone), code }),
  completeRegistration: ({ registrationToken, pin }) =>
    apiClient.post('/api/auth/register/complete', {
      registrationToken,
      pin,
      privacyNoticeVersion: PRIVACY_NOTICE_VERSION,
      privacyNoticeAcknowledged: true,
    }),
  login: ({ identifier, pin }) =>
    apiClient.post('/api/auth/login', { identifier: toLocalPhone(identifier), pin }),
  logout: () =>
    apiClient.post(
      '/api/auth/logout',
      { refreshToken: localStorage.getItem('refresh_token') },
      { timeout: 3000 }
    ),
  getMe: () => apiClient.get('/api/me'),
  updateRole: (role) => apiClient.post('/api/me/roles', { role }),
};