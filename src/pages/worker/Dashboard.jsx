import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { User, Briefcase, ClipboardList } from 'lucide-react';
import { jobsApi } from '@/lib/api/jobs';
import { unwrapList } from '@/lib/utils/api';
import { queryDefaults } from '@/lib/utils/network';
import Card from '@/components/ui/Card';
import Chip from '@/components/ui/Chip';
import Button from '@/components/ui/Button';
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

export default function WorkerDashboard() {
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
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
          const employer =
            application.job?.employer?.companyName || application.job?.employer?.name;
          return (
            <div key={application.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-body2 font-bold text-navy-500">
                  {application.job?.title || 'Job'}
                </p>
                {employer && (
                  <p className="truncate text-caption text-navy-500/70">{employer}</p>
                )}
              </div>
              {status && <Chip tone={statusTone[status] || 'neutral'}>{capitalise(status)}</Chip>}
            </div>
          );
        })}
      </Card>
    );
  }

  return (
    <div className="text-left">
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
    </div>
  );
}