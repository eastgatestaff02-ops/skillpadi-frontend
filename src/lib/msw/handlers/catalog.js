import { http, HttpResponse, delay } from 'msw';
import { trades, states, skills } from '../data/catalog';

export const catalogHandlers = [
  http.get('/api/trades', async () => {
    await delay(300);
    return HttpResponse.json({ data: trades });
  }),
  http.get('/api/states', async () => {
    await delay(300);
    return HttpResponse.json({ data: states });
  }),
  http.get('/api/skills', async () => {
    await delay(300);
    return HttpResponse.json({ data: skills });
  }),
];