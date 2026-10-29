import { rest } from 'msw';

const STAGING_URL = 'https://skillpadi-backend-staging.onrender.com';

export const authHandlers = [
  // Example: Simulate rate limit for testing
  rest.post(`${STAGING_URL}/api/auth/register/otp/request`, (req, res, ctx) => {
    const requests = JSON.parse(localStorage.getItem('mock_otp_requests') || '[]');
    if (requests.length >= 3) {
      return res(
        ctx.status(429),
        ctx.json({ error: { code: 'RATE_LIMITED', message: 'Too many requests' } })
      );
    }
    return req.passthrough(); // Let the real backend handle it
  }),
];