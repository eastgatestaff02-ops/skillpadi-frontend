import { apiClient } from './client';

export const authApi = {
  
  
  requestOtp: (data) => apiClient.post('/api/auth/register/otp/request', data), // { phone }
  verifyOtp: (data) => apiClient.post('/api/auth/register/otp/verify', data),   // { phone, otp }
  completeRegistration: (data) => apiClient.post('/api/auth/register/complete', data), // { phone, otp_token, pin, name, role }
  
  
  login: (data) => apiClient.post('/api/auth/login', data), // { identifier, password/pin }
  
  
  logout: () => apiClient.post('/api/auth/logout'),
  getMe: () => apiClient.get('/api/me'),
  updateRole: (role) => apiClient.post('/api/me/roles', { role }),
};