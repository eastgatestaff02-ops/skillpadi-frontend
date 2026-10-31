// src/lib/msw/handlers/worker.js
import { rest } from 'msw';

export const workerHandlers = [
  // Example: Mock the GET profile endpoint
  rest.get('/api/workers/profile/me', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'worker-123',
        firstName: 'John',
        lastName: 'Doe',
        phone: '+2348000000001',
        trade: { id: 'trade-1', name: 'Electrician' },
        location: 'Lagos',
        yearsOfExperience: 5,
        rating: 4.8,
        reviewCount: 12,
        portfolio: [],
      })
    );
  }),

  // Example: Mock the search endpoint
  rest.get('/api/profiles/workers', (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 'worker-123',
            trade: { name: 'Electrician' },
            state: { name: 'Lagos' },
            lga: { name: 'Ikeja' },
            yearsExperience: 5,
          }
        ],
        pagination: { page: 1, pageSize: 20, total: 1, totalPages: 1 }
      })
    );
  }),
];