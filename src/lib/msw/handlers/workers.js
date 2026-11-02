import { http, HttpResponse, delay } from 'msw';
import { trades, states, skills } from '../data/catalog';
import { workers, contactPhones, reviewsByWorker, myProfile, photo } from '../data/workers';
import { jobs } from '../data/jobs';

const find = (list, id) => list.find((item) => item.id === id) || null;

const workerApplications = [
  {
    id: 'wapp-1',
    jobId: 'job-2',
    status: 'pending',
    createdAt: '2026-10-22T09:00:00.000Z',
    job: { id: 'job-2', title: 'Rewire living room sockets', employer: { companyName: 'Demo Employer' } },
  },
];

const fail = (status, code, message) =>
  HttpResponse.json({ error: { code, message } }, { status });

const myProfileResponse = () => ({
  id: myProfile.id,
  trade: find(trades, myProfile.tradeId),
  state: find(states, myProfile.stateId),
  yearsExperience: myProfile.yearsExperience,
  skills: myProfile.skillIds.map((id) => find(skills, id)).filter(Boolean),
  portfolio: myProfile.portfolio,
});

export const workerHandlers = [
  http.get('/api/profiles/workers/me', async () => {
    await delay(400);
    return HttpResponse.json({ data: myProfileResponse() });
  }),

  http.put('/api/profiles/workers/me', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    myProfile.tradeId = body.tradeId || '';
    myProfile.stateId = body.stateId || '';
    myProfile.yearsExperience =
      body.yearsExperience === undefined || body.yearsExperience === null
        ? null
        : Number(body.yearsExperience);
    myProfile.skillIds = Array.isArray(body.skillIds) ? body.skillIds : [];
    return HttpResponse.json({ data: myProfileResponse() });
  }),

  http.post('/api/profiles/workers/me/portfolio', async () => {
    await delay(800);
    const count = myProfile.portfolio.length + 1;
    myProfile.portfolio.push({
      id: `photo-${Date.now()}`,
      url: photo(`Work photo ${count}`, count),
    });
    return HttpResponse.json({ data: myProfileResponse() }, { status: 201 });
  }),

  http.get('/api/profiles/workers', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const tradeId = url.searchParams.get('tradeId');
    const stateId = url.searchParams.get('stateId');
    const page = Math.max(1, Number(url.searchParams.get('page')) || 1);
    const pageSize = Math.max(1, Number(url.searchParams.get('pageSize')) || 20);

    const filtered = workers.filter(
      (worker) =>
        (!tradeId || worker.trade.id === tradeId) && (!stateId || worker.state.id === stateId)
    );
    const start = (page - 1) * pageSize;

    return HttpResponse.json({
      data: filtered.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        total: filtered.length,
        totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      },
    });
  }),

  http.get('/api/profiles/workers/:id', async ({ params }) => {
    await delay(400);
    const worker = find(workers, params.id);
    if (!worker) return fail(404, 'NOT_FOUND', 'Worker not found');
    return HttpResponse.json({ data: worker });
  }),

  http.post('/api/profiles/workers/:id/contact', async ({ params }) => {
    await delay(500);
    const phone = contactPhones[params.id];
    if (!phone) return fail(404, 'NOT_FOUND', 'Worker not found');
    return HttpResponse.json({
      data: { phone, whatsappUrl: `https://wa.me/${phone.replace('+', '')}` },
    });
  }),

  http.get('/api/reviews/worker/:id', async ({ params }) => {
    await delay(400);
    return HttpResponse.json({ data: reviewsByWorker[params.id] || [] });
  }),

  http.post('/api/reviews', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    if (!body.rating) return fail(400, 'VALIDATION_ERROR', 'Invalid request');
    return HttpResponse.json({ data: { id: `r-${Date.now()}`, ...body } }, { status: 201 });
  }),

  http.post('/api/reports', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    if (!body.reason) return fail(400, 'VALIDATION_ERROR', 'Invalid request');
    return HttpResponse.json({ data: { id: `report-${Date.now()}` } }, { status: 201 });
  }),

  http.post('/api/jobs/:id/apply', async ({ params }) => {
    await delay(600);
    const job = find(jobs, params.id);
    if (!job) return fail(404, 'NOT_FOUND', 'Job not found');
    if (workerApplications.some((item) => item.jobId === job.id)) {
      return fail(409, 'ALREADY_APPLIED', 'You have already applied to this job');
    }
    const application = {
      id: `wapp-${Date.now()}`,
      jobId: job.id,
      status: 'pending',
      createdAt: new Date().toISOString(),
      job: { id: job.id, title: job.title, employer: { companyName: 'Demo Employer' } },
    };
    workerApplications.unshift(application);
    return HttpResponse.json({ data: application }, { status: 201 });
  }),

  http.get('/api/workers/applications', async () => {
    await delay(500);
    return HttpResponse.json({ data: workerApplications });
  }),
];