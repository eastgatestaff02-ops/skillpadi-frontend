import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Briefcase, ClipboardList, Star } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { unwrapList } from '@/lib/utils/api';
import { queryDefaults } from '@/lib/utils/network';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
import RatingModal from '@/components/shared/RatingModal';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const statusTone = {
  pending: 'ochre',
  accepted: 'success',
  declined: 'danger',
  rejected: 'danger',
};

const capitalise = (value) => value.charAt(0).toUpperCase() + value.slice(1);

const shortcuts = [
  {
    to: '/worker/profile',
    icon: User,
    title: 'My profile',
    description: 'Update your skills and work photos.',
  },
  {
    to: '/worker/jobs',
    icon: Briefcase,
    title: 'Find jobs',
    description: 'Browse open work near you.',
  },
];

const FINISHED_JOB = ['filled', 'completed'];

export default function WorkerDashboard() {
  const [ratingTarget, setRatingTarget] = useState(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => jobsApi.getMyApplications().then((res) => unwrapList(res.data)),
    ...queryDefaults,
  });

  const applications = data || [];

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading your applications..." variant="list" />;
  } else if (isError) {
    content = <ErrorState message="We could not load your applications." onRetry={refetch} />;
  } else if (applications.length === 0) {
    content = (
      <EmptyState
        icon={ClipboardList}
        title="No applications yet"
        message="Apply to a job and you can follow its progress here."
        action={
          <Button to="/worker/jobs" variant="outlined">
            Find jobs
          </Button>
        }
      />
    );
  } else {
    content = (
      <Card className="divide-y divide-navy-50 p-0">
        {applications.map((application) => {
          const status = String(application.status || '').toLowerCase();
          const jobStatus = String(application.job?.status || '').toLowerCase();
          const employerId = application.job?.employer?.id ?? application.job?.employerId;
          const employer =
            application.job?.employer?.companyName || application.job?.employer?.name;
          const canRate =
            status === 'accepted' && FINISHED_JOB.includes(jobStatus) && !!employerId;

          return (
            <div key={application.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-body2 font-bold text-navy-500">
                    {application.job?.title || 'Job'}
                  </p>
                  {employer && (
                    <p className="truncate text-caption text-navy-500/70">{employer}</p>
                  )}
                </div>
                {status && (
                  <Chip tone={statusTone[status] || 'neutral'}>{capitalise(status)}</Chip>
                )}
              </div>

              {canRate && (
                <Button
                  variant="outlined"
                  size="sm"
                  leftIcon={Star}
                  className="mt-3"
                  onClick={() =>
                    setRatingTarget({
                      jobId: application.job.id,
                      employerId,
                      employerName: employer || 'the employer',
                    })
                  }
                >
                  Rate employer
                </Button>
              )}
            </div>
          );
        })}
      </Card>
    );
  }

  return (
    <div className="text-left">
      <div className="mb-6 relative w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm">
        <img
          src="/worker_tools.jpg"
          alt="Worker Tools"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900/80 to-transparent flex items-center p-6 md:p-8">
          <div className="max-w-md text-white">
            <h2 className="text-2xl font-bold mb-2">Ready to work?</h2>
            <p className="text-sm opacity-90">
              Complete your profile and find new jobs in Lagos today.
            </p>
          </div>
        </div>
      </div>

      <h1 className="text-h2 font-bold text-navy-500">Home</h1>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {shortcuts.map(({ to, icon: Icon, title, description }) => (
          <Card
            key={to}
            as={Link}
            to={to}
            className="flex items-center gap-3 transition-colors hover:border-ochre-200"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ochre-100">
              <Icon size={22} className="text-navy-500" />
            </span>
            <span>
              <span className="block text-body1 font-bold text-navy-500">{title}</span>
              <span className="block text-body2 text-navy-500/70">{description}</span>
            </span>
          </Card>
        ))}
      </div>

      <h2 className="mb-3 mt-8 text-h3 font-bold text-navy-500">My applications</h2>
      {content}

      <RatingModal
        isOpen={!!ratingTarget}
        onClose={() => setRatingTarget(null)}
        jobId={ratingTarget?.jobId}
        revieweeId={ratingTarget?.employerId}
        revieweeName={ratingTarget?.employerName}
      />
    </div>
  );
}