import { http, HttpResponse, delay } from 'msw';
import { jobs } from '../data/jobs';
import { JOB_STATUS, URGENCY } from '@/lib/utils/constants';
import { getCurrentUser, DEMO_EMPLOYER } from '../utils';

const matches = (value, query) =>
  !query || String(value).toLowerCase().includes(String(query).toLowerCase());

export const employerHandlers = [
  http.get('/api/employer/jobs', async () => {
    await delay(500);
    const employer = getCurrentUser(DEMO_EMPLOYER);
    const mine = jobs
      .filter((job) => job.employerId === employer.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return HttpResponse.json(mine);
  }),

  http.get('/api/jobs', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const trade = url.searchParams.get('trade');
    const location = url.searchParams.get('location');
    const open = jobs.filter(
      (job) =>
        job.status === JOB_STATUS.OPEN &&
        matches(job.trade, trade) &&
        matches(job.location, location)
    );
    return HttpResponse.json(open);
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    await delay(400);
    const job = jobs.find((item) => item.id === params.id);
    if (!job) {
      return HttpResponse.json({ error: { message: 'Job not found' } }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  http.post('/api/jobs', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    const missing = ['title', 'description', 'trade', 'location'].filter(
      (field) => !body[field] || !String(body[field]).trim()
    );
    if (missing.length > 0) {
      return HttpResponse.json(
        { error: { message: `Missing required fields: ${missing.join(', ')}` } },
        { status: 400 }
      );
    }
    const employer = getCurrentUser(DEMO_EMPLOYER);
    const job = {
      id: `job-${Date.now()}`,
      employerId: employer.id,
      title: body.title.trim(),
      description: body.description.trim(),
      trade: body.trade,
      location: body.location.trim(),
      budget: body.budget ? Number(body.budget) : null,
      urgency: body.urgency || URGENCY.NORMAL,
      status: JOB_STATUS.OPEN,
      createdAt: new Date().toISOString(),
      applicants: [],
    };
    jobs.unshift(job);
    return HttpResponse.json(job, { status: 201 });
  }),

  http.patch('/api/jobs/:id/status', async ({ params, request }) => {
    await delay(400);
    const { status } = await request.json();
    if (!Object.values(JOB_STATUS).includes(status)) {
      return HttpResponse.json({ error: { message: 'Invalid status' } }, { status: 400 });
    }
    const job = jobs.find((item) => item.id === params.id);
    if (!job) {
      return HttpResponse.json({ error: { message: 'Job not found' } }, { status: 404 });
    }
    job.status = status;
    return HttpResponse.json(job);
  }),
];