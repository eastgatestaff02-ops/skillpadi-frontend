import { http, HttpResponse, delay } from 'msw';

const OTP_CODE = '123456';
const DEMO_PIN = '1234';

const users = [
  { id: 'user-worker', name: 'Demo Worker', phone: '+2348000000001', role: 'worker', pin: DEMO_PIN },
  { id: 'user-employer', name: 'Demo Employer', phone: '+2348000000002', role: 'employer', pin: DEMO_PIN },
  { id: 'user-apprentice', name: 'Demo Apprentice', phone: '+2348000000003', role: 'apprentice', pin: DEMO_PIN },
];

const publicUser = ({ pin, ...rest }) => rest;

const tokensFor = (user) => ({
  access_token: `mock-access-${user.id}`,
  refresh_token: `mock-refresh-${user.id}`,
});

const normalisePhone = (value) => {
  const cleaned = String(value || '').replace(/[\s-]/g, '');
  if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
  if (cleaned.startsWith('234')) return `+${cleaned}`;
  return cleaned;
};

const userFromRequest = (request) => {
  const header = request.headers.get('Authorization') || '';
  const id = header.replace('Bearer mock-access-', '');
  return users.find((user) => user.id === id) || null;
};

const fail = (status, code, message) =>
  HttpResponse.json({ error: { code, message } }, { status });

export const authHandlers = [
  http.post('/api/auth/register/otp/request', async ({ request }) => {
    await delay(500);
    const { phone } = await request.json();
    if (!phone) return fail(400, 'VALIDATION_ERROR', 'Invalid request');
    return HttpResponse.json({ data: { sent: true } });
  }),

  http.post('/api/auth/register/otp/verify', async ({ request }) => {
    await delay(500);
    const { phone, otp } = await request.json();
    if (otp !== OTP_CODE) return fail(400, 'OTP_INVALID', 'Invalid code');
    return HttpResponse.json({ registration_token: `mock-registration-${phone}` });
  }),

  http.post('/api/auth/register/complete', async ({ request }) => {
    await delay(600);
    const { phone, otp_token: otpToken, pin, name } = await request.json();
    if (otpToken !== `mock-registration-${phone}`) {
      return fail(400, 'OTP_INVALID', 'Verification expired. Please start again.');
    }
    if (users.some((user) => user.phone === phone)) {
      return fail(409, 'PHONE_EXISTS', 'An account with this phone number already exists');
    }
    const user = { id: `user-${Date.now()}`, name, phone, role: null, pin };
    users.push(user);
    return HttpResponse.json({ ...tokensFor(user), user: publicUser(user) }, { status: 201 });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(500);
    const { identifier, password } = await request.json();
    const phone = normalisePhone(identifier);
    const user = users.find((item) => item.phone === phone);
    if (!user || user.pin !== password) {
      return fail(401, 'UNAUTHORIZED', 'Invalid credentials');
    }
    return HttpResponse.json({ ...tokensFor(user), user: publicUser(user) });
  }),

  http.post('/api/auth/refresh', async ({ request }) => {
    const { refresh_token: refreshToken } = await request.json();
    const id = String(refreshToken || '').replace('mock-refresh-', '');
    const user = users.find((item) => item.id === id);
    if (!user) return fail(401, 'UNAUTHORIZED', 'Invalid or expired token');
    return HttpResponse.json(tokensFor(user));
  }),

  http.post('/api/auth/logout', () => new HttpResponse(null, { status: 204 })),

  http.get('/api/me', async ({ request }) => {
    const user = userFromRequest(request);
    if (!user) return fail(401, 'UNAUTHORIZED', 'Missing token');
    return HttpResponse.json({ data: publicUser(user) });
  }),

  http.post('/api/me/roles', async ({ request }) => {
    await delay(400);
    const user = userFromRequest(request);
    const { role } = await request.json();
    if (!user) return fail(401, 'UNAUTHORIZED', 'Missing token');
    user.role = role;
    return HttpResponse.json({ data: { role } });
  }),
];