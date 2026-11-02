import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Avatar from '@/components/ui/Avatar';
import TextField from '@/components/ui/TextField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import StarRating, { StarDisplay } from '@/components/ui/StarRating';
import WorkerCard from '@/features/employer/WorkerCard';
import JobCard from '@/features/employer/JobCard';
import MarkFilledPrompt from '@/features/employer/MarkFilledPrompt';
import ReviewCard from '@/features/trust/ReviewCard';
import ReportProfileSheet from '@/features/trust/ReportProfileSheet';
import RatingModal from '@/components/shared/RatingModal';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const sampleWorker = {
  id: 'w1',
  yearsExperience: 5,
  trade: { name: 'Electrician' },
  state: { name: 'Lagos' },
  lga: { name: 'Ikeja' },
  skills: [
    { id: 's1', name: 'Wiring' },
    { id: 's2', name: 'Fault finding' },
    { id: 's3', name: 'Installation' },
    { id: 's4', name: 'Maintenance' },
  ],
};

const openJob = {
  id: 'j1',
  title: 'Repair shop wiring',
  description: 'Inspect a kitchen circuit and replace damaged wiring.',
  trade: 'Electrical',
  location: 'Ikeja, Lagos',
  budget: 85000,
  status: 'open',
  createdAt: '2026-10-08T09:00:00.000Z',
  applicantCount: 4,
};

const filledJob = { ...openJob, id: 'j2', status: 'filled' };

const sampleReview = {
  id: 'r1',
  reviewerName: 'Chidinma Nwosu',
  rating: 5,
  comment: 'Arrived on time and explained the repairs clearly.',
  createdAt: '2026-10-20T09:00:00.000Z',
};

function Section({ title, children }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-h3 font-bold text-navy-500">{title}</h2>
      {children}
    </section>
  );
}

export default function Preview() {
  const [rating, setRating] = useState(3);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [promptJob, setPromptJob] = useState(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 text-left">
      <h1 className="mb-1 text-h1 font-bold text-navy-500">UI preview</h1>
      <p className="mb-8 text-body2 text-navy-500/70">
        Sample data only. Remove this page before the demo.
      </p>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button leftIcon={Plus}>Filled</Button>
          <Button variant="outlined">Outlined</Button>
          <Button variant="text">Text</Button>
          <Button disabled>Disabled</Button>
          <Button tone="error">Error</Button>
          <Button tone="error" variant="outlined">
            Error outlined
          </Button>
          <Button loading>Loading</Button>
        </div>
      </Section>

      <Section title="Fields and messages">
        <Card className="space-y-4">
          <TextField label="Default" icon={Search} placeholder="Placeholder" />
          <TextField label="Error" icon={Search} error="Something is wrong." defaultValue="abc" />
          <FeedbackBanner tone="info">Information message.</FeedbackBanner>
          <FeedbackBanner tone="success">Success message.</FeedbackBanner>
          <FeedbackBanner tone="error">Error message.</FeedbackBanner>
          <FeedbackBanner tone="offline">You are offline.</FeedbackBanner>
        </Card>
      </Section>

      <Section title="Chips, avatars and stars">
        <Card className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Chip>Neutral</Chip>
            <Chip tone="ochre">Ochre</Chip>
            <Chip tone="success">Open</Chip>
            <Chip tone="danger">Filled</Chip>
          </div>
          <div className="flex items-center gap-3">
            <Avatar name="Adewale Okafor" size="sm" />
            <Avatar name="Adewale Okafor" />
            <Avatar name="Adewale Okafor" size="lg" />
            <Avatar />
          </div>
          <StarRating value={rating} onChange={setRating} />
          <StarDisplay value={4.5} />
        </Card>
      </Section>

      <Section title="Cards">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <WorkerCard worker={sampleWorker} />
          <ReviewCard review={sampleReview} />
          <JobCard job={openJob} onMarkFilled={setPromptJob} />
          <JobCard job={filledJob} />
        </div>
      </Section>

      <Section title="States">
        <div className="space-y-4">
          <LoadingSpinner label="Loading..." />
          <EmptyState title="No workers found" message="Try a different trade or nearby location." />
          <ErrorState message="We could not load this." onRetry={() => {}} />
        </div>
      </Section>

      <Section title="Pop-ups">
        <div className="flex flex-wrap gap-3">
          <Button variant="outlined" onClick={() => setRatingOpen(true)}>
            Rating
          </Button>
          <Button variant="outlined" onClick={() => setReportOpen(true)}>
            Report
          </Button>
          <Button variant="outlined" onClick={() => setPromptJob(openJob)}>
            Mark filled
          </Button>
        </div>
      </Section>

      <RatingModal
        isOpen={ratingOpen}
        onClose={() => setRatingOpen(false)}
        jobId="job-1"
        revieweeId="worker-1"
        revieweeName="Adewale Okafor"
      />
      <ReportProfileSheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={() => new Promise((resolve) => setTimeout(resolve, 600))}
      />
      <MarkFilledPrompt
        job={promptJob}
        onConfirm={() => setPromptJob(null)}
        onCancel={() => setPromptJob(null)}
      />
    </div>
  );
}