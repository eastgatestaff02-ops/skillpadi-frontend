import { apiClient } from './client';

export const authApi = {
  // Registration
  requestOtp: (data) => apiClient.post('/auth/register/otp/request', data), // { phone }
  verifyOtp: (data) => apiClient.post('/auth/register/otp/verify', data),   // { phone, otp }
  completeRegistration: (data) => apiClient.post('/auth/register/complete', data), // { phone, otp_token, pin, name, role }
  
  // Login
  startLogin: (data) => apiClient.post('/auth/login/start', data),          // { identifier, password/pin }
  verifyLoginOtp: (data) => apiClient.post('/auth/login/verify', data),     // { phone, otp }
  
  // Session & Role
  logout: () => apiClient.post('/auth/logout'),
  getMe: () => apiClient.get('/me'),
  updateRole: (role) => apiClient.post('/me/roles', { role }),
};