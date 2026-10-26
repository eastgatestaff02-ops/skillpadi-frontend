import { http, HttpResponse, delay } from 'msw';
import { listings, applications, trainerProfile } from '../data/apprenticeship';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import {
  getCurrentUser,
  DEMO_TRAINER,
  DEMO_APPRENTICE,
} from '../utils';

const matches = (value, query) =>
  !query || String(value).toLowerCase().includes(String(query).toLowerCase());

const withListing = (application) => {
  const listing = listings.find((item) => item.id === application.listingId);
  return {
    ...application,
    listing: listing
      ? {
          id: listing.id,
          trade: listing.trade,
          location: listing.location,
          duration: listing.duration,
          trainerName: listing.trainerName,
        }
      : null,
  };
};

const sortNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);

export const apprenticeshipHandlers = [
  http.get('/api/listings', async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const trade = url.searchParams.get('trade');
    const location = url.searchParams.get('location');
    const result = listings
      .filter(
        (listing) =>
          listing.status === 'open' &&
          matches(listing.trade, trade) &&
          matches(listing.location, location)
      )
      .sort(sortNewest);
    return HttpResponse.json(result);
  }),

  http.get('/api/listings/:id', async ({ params }) => {
    await delay(400);
    const listing = listings.find((item) => item.id === params.id);
    if (!listing) {
      return HttpResponse.json({ error: { message: 'Listing not found' } }, { status: 404 });
    }
    return HttpResponse.json(listing);
  }),

  http.post('/api/listings', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    const missing = ['trade', 'location', 'duration'].filter(
      (field) => !body[field] || !String(body[field]).trim()
    );
    if (missing.length > 0) {
      return HttpResponse.json(
        { error: { message: `Missing required fields: ${missing.join(', ')}` } },
        { status: 400 }
      );
    }
    const trainer = getCurrentUser(DEMO_TRAINER);
    const listing = {
      id: `listing-${Date.now()}`,
      trainerId: trainer.id,
      trainerName: trainer.name,
      trade: body.trade,
      location: body.location.trim(),
      duration: body.duration.trim(),
      requirements: body.requirements ? body.requirements.trim() : '',
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    listings.unshift(listing);
    return HttpResponse.json(listing, { status: 201 });
  }),

  http.get('/api/trainer/listings', async () => {
    await delay(500);
    const trainer = getCurrentUser(DEMO_TRAINER);
    const mine = listings
      .filter((listing) => listing.trainerId === trainer.id)
      .sort(sortNewest);
    return HttpResponse.json(mine);
  }),

  http.get('/api/trainers/profile/me', async () => {
    await delay(400);
    return HttpResponse.json(trainerProfile);
  }),

  http.put('/api/trainers/profile/me', async ({ request }) => {
    await delay(500);
    const body = await request.json();
    Object.assign(trainerProfile, {
      trade: body.trade,
      yearsOfTraining: Number(body.yearsOfTraining),
      apprenticesTrained: Number(body.apprenticesTrained),
      bio: body.bio,
    });
    return HttpResponse.json(trainerProfile);
  }),

  http.post('/api/applications', async ({ request }) => {
    await delay(600);
    const body = await request.json();
    const listing = listings.find((item) => item.id === body.listingId);
    if (!listing) {
      return HttpResponse.json({ error: { message: 'Listing not found' } }, { status: 404 });
    }
    if (!body.whyInterested || !String(body.whyInterested).trim() || !body.availability) {
      return HttpResponse.json(
        { error: { message: 'Please fill in why you are interested and your availability' } },
        { status: 400 }
      );
    }
    const apprentice = getCurrentUser(DEMO_APPRENTICE);
    const alreadyApplied = applications.some(
      (item) => item.listingId === listing.id && item.apprenticeId === apprentice.id
    );
    if (alreadyApplied) {
      return HttpResponse.json(
        { error: { message: 'You have already applied to this listing' } },
        { status: 409 }
      );
    }
    const application = {
      id: `app-${Date.now()}`,
      listingId: listing.id,
      apprenticeId: apprentice.id,
      apprenticeName: apprentice.name,
      apprenticePhone: apprentice.phone,
      whyInterested: body.whyInterested.trim(),
      availability: body.availability,
      status: APPLICATION_STATUS.PENDING,
      createdAt: new Date().toISOString(),
    };
    applications.unshift(application);
    return HttpResponse.json(withListing(application), { status: 201 });
  }),

  http.get('/api/applications/mine', async () => {
    await delay(500);
    const apprentice = getCurrentUser(DEMO_APPRENTICE);
    const mine = applications
      .filter((item) => item.apprenticeId === apprentice.id)
      .sort(sortNewest)
      .map(withListing);
    return HttpResponse.json(mine);
  }),

  http.get('/api/trainer/applications', async () => {
    await delay(500);
    const trainer = getCurrentUser(DEMO_TRAINER);
    const trainerListingIds = listings
      .filter((listing) => listing.trainerId === trainer.id)
      .map((listing) => listing.id);
    const received = applications
      .filter((item) => trainerListingIds.includes(item.listingId))
      .sort(sortNewest)
      .map(withListing);
    return HttpResponse.json(received);
  }),

  http.patch('/api/applications/:id/status', async ({ params, request }) => {
    await delay(400);
    const { status } = await request.json();
    const allowed = [APPLICATION_STATUS.ACCEPTED, APPLICATION_STATUS.DECLINED];
    if (!allowed.includes(status)) {
      return HttpResponse.json({ error: { message: 'Invalid status' } }, { status: 400 });
    }
    const application = applications.find((item) => item.id === params.id);
    if (!application) {
      return HttpResponse.json({ error: { message: 'Application not found' } }, { status: 404 });
    }
    application.status = status;
    return HttpResponse.json(withListing(application));
  }),
];