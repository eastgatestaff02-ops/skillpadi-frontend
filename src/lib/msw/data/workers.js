import { trades, states, skills } from './catalog';

const find = (list, id) => list.find((item) => item.id === id);
const pick = (ids) => ids.map((id) => find(skills, id)).filter(Boolean);

const fills = ['#eeddc2', '#bddcd1', '#e7c1be', '#dbdee2'];

export const photo = (label, index = 0) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="400" height="400" fill="${fills[index % fills.length]}"/><text x="200" y="210" font-family="sans-serif" font-size="26" text-anchor="middle" fill="#11233f">${label}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const seed = [
  { id: 'w-1', tradeId: 'trade-electrician', stateId: 'state-lagos', lga: 'Ikeja', years: 5, skillIds: ['skill-wiring', 'skill-fault-finding', 'skill-installation'], phone: '+2348031112222', rating: 4.8, reviewCount: 2 },
  { id: 'w-2', tradeId: 'trade-plumber', stateId: 'state-lagos', lga: 'Surulere', years: 8, skillIds: ['skill-pipe-fitting', 'skill-installation'], phone: '+2348032223333', rating: 4.5, reviewCount: 1 },
  { id: 'w-3', tradeId: 'trade-carpenter', stateId: 'state-oyo', lga: 'Ibadan North', years: 3, skillIds: ['skill-finishing', 'skill-installation'], phone: '+2348033334444', rating: 0, reviewCount: 0 },
  { id: 'w-4', tradeId: 'trade-tailor', stateId: 'state-oyo', lga: 'Ibadan South', years: 6, skillIds: ['skill-cutting', 'skill-finishing'], phone: '+2348034445555', rating: 0, reviewCount: 0 },
  { id: 'w-5', tradeId: 'trade-electrician', stateId: 'state-fct', lga: 'Garki', years: 2, skillIds: ['skill-wiring'], phone: '+2348035556666', rating: 0, reviewCount: 0 },
  { id: 'w-6', tradeId: 'trade-welder', stateId: 'state-rivers', lga: 'Port Harcourt', years: 10, skillIds: ['skill-welding', 'skill-maintenance'], phone: '+2348036667777', rating: 0, reviewCount: 0 },
  { id: 'w-7', tradeId: 'trade-painter', stateId: 'state-ogun', lga: 'Abeokuta', years: 4, skillIds: ['skill-finishing'], phone: '+2348037778888', rating: 0, reviewCount: 0 },
  { id: 'w-8', tradeId: 'trade-plumber', stateId: 'state-fct', lga: 'Wuse', years: 1, skillIds: ['skill-pipe-fitting'], phone: '+2348038889999', rating: 0, reviewCount: 0 },
];

export const workers = seed.map((item, index) => ({
  id: item.id,
  yearsExperience: item.years,
  isPublic: true,
  trade: find(trades, item.tradeId),
  state: find(states, item.stateId),
  lga: { id: `lga-${item.id}`, name: item.lga, slug: item.lga.toLowerCase().replace(/\s+/g, '-') },
  skills: pick(item.skillIds),
  portfolio: index < 3 ? [photo('Recent job', index), photo('Finished work', index + 1)] : [],
  rating: item.rating,
  reviewCount: item.reviewCount,
  createdAt: '2026-09-15T09:00:00.000Z',
}));

export const contactPhones = Object.fromEntries(seed.map((item) => [item.id, item.phone]));

export const reviewsByWorker = {
  'w-1': [
    { id: 'r-1', reviewerName: 'Chidinma Nwosu', rating: 5, comment: 'Arrived on time and explained the repairs clearly.', createdAt: '2026-10-20T09:00:00.000Z' },
    { id: 'r-2', reviewerName: 'Tunde Bello', rating: 5, comment: 'Neat work and fair price.', createdAt: '2026-10-02T09:00:00.000Z' },
  ],
  'w-2': [
    { id: 'r-3', reviewerName: 'Amaka Eze', rating: 4, comment: 'Fixed the leak quickly.', createdAt: '2026-09-28T09:00:00.000Z' },
  ],
};

export const myProfile = {
  id: 'w-1',
  tradeId: '',
  stateId: '',
  yearsExperience: null,
  skillIds: [],
  portfolio: [],
};