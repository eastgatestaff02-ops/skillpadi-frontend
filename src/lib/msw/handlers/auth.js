import { http, HttpResponse, delay } from 'msw';

const OTP_CODE = '123456';
const DEMO_PASSWORD = 'Password1';

const users = [
  { id: 'user-worker', name: 'Demo Worker', phone: '+2348000000001', email: 'worker@demo.com', role: 'worker', password: DEMO_PASSWORD },
  { id: 'user-employer', name: 'Demo Employer', phone: '+2348000000002', email: 'employer@demo.com', role: 'employer', password: DEMO_PASSWORD },
  { id: 'user-apprentice', name: 'Demo Apprentice', phone: '+2348000000003', email: 'apprentice@demo.com', role: 'apprentice', password: DEMO_PASSWORD },
];

const publicUser = ({ password, ...rest }) => rest;

const tokensFor = (user) => ({
  access_token: `mock-access-${user.id}`,
  refresh_token: `mock-refresh-${user.id}`,
});

const normaliseIdentifier = (value) => {
  const trimmed = String(value || '').trim();
  if (trimmed.includes('@')) return trimmed.toLowerCase();
  const cleaned = trimmed.replace(/[\s-]/g, '');
  if (cleaned.startsWith('0')) return `+234${cleaned.slice(1)}`;
  if (cleaned.startsWith('234')) return `+${cleaned}`;
  return cleaned;
};

const identifierFrom = (body) => normaliseIdentifier(body.phone || body.email);

const userFromRequest = (request) => {
  const header = request.headers.get('Authorization') || '';
  const id = header.replace('Bearer mock-access-', '');
  return users.find((user) => user.id === id) || null;
};

const fail = (status, code, message, details) =>
  HttpResponse.json(
    { error: { code, message, ...(details ? { details } : {}) } },
    { status }
  );

export const authHandlers = [
  http.post('/api/auth/register/otp/request', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    if (!body.phone && !body.email) {
      return fail(400, 'VALIDATION_ERROR', 'Invalid request', [
        { path: 'phone', message: 'Enter a phone number or an email' },
      ]);
    }
    return HttpResponse.json({ data: { sent: true } });
  }),

  http.post('/api/auth/register/otp/verify', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    if (body.otp !== OTP_CODE) return fail(400, 'OTP_INVALID', 'Invalid code');
    return HttpResponse.json({ registration_token: `mock-registration-${identifierFrom(body)}` });
  }),

  http.post('/api/auth/register/complete', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    const identifier = identifierFrom(body);

    if (body.otp_token !== `mock-registration-${identifier}`) {
      return fail(400, 'OTP_INVALID', 'Verification expired. Please start again.');
    }
    if (!body.password || String(body.password).length < 8) {
      return fail(400, 'VALIDATION_ERROR', 'Invalid request', [
        { path: 'password', message: 'Password must be at least 8 characters.' },
      ]);
    }
    if (users.some((user) => user.phone === identifier || user.email === identifier)) {
      return fail(409, 'ACCOUNT_EXISTS', 'An account with these details already exists');
    }

    const user = {
      id: `user-${Date.now()}`,
      name: body.name,
      phone: body.phone ? identifier : null,
      email: body.email ? identifier : null,
      role: null,
      password: body.password,
    };
    users.push(user);
    return HttpResponse.json({ ...tokensFor(user), user: publicUser(user) }, { status: 201 });
  }),

  http.post('/api/auth/login', async ({ request }) => {
    await delay(500);
    const { identifier, password } = await request.json();
    const normalised = normaliseIdentifier(identifier);
    const user = users.find((item) => item.phone === normalised || item.email === normalised);
    if (!user || user.password !== password) {
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