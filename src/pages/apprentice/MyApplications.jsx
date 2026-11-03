import { MapPin, Clock, User, ClipboardList } from 'lucide-react';
import { useMyApplications } from '@/lib/hooks/useApplications';
import { unwrapList } from '@/lib/utils/api';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import StatusBadge from '@/features/apprenticeship/StatusBadge';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function MyApplications() {
  const { data, isLoading, isError, refetch } = useMyApplications();
  const applications = unwrapList(data);

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
        message="Find an apprenticeship and apply. Your applications will show up here."
        action={<Button to="/apprentice/listings">Browse apprenticeships</Button>}
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {applications.map((application) => {
          const status = String(application.status || '').toLowerCase();
          const listing = application.listing;
          const trade = listing?.trade?.name || listing?.trade;

          return (
            <Card key={application.id}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-body1 font-bold text-navy-500">
                  {trade ? `${trade} apprenticeship` : 'Apprenticeship'}
                </h3>
                <StatusBadge status={application.status} />
              </div>

              {listing && (
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-caption text-navy-500/70">
                  <span className="flex items-center gap-1">
                    <User size={12} /> {listing.trainerName}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {listing.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {listing.duration}
                  </span>
                </div>
              )}

              <p className="mt-3 text-caption text-navy-500/60">
                Applied {formatDate(application.createdAt)}
                {application.availability && ` · ${application.availability}`}
              </p>

              {status === APPLICATION_STATUS.ACCEPTED && (
                <FeedbackBanner tone="success" className="mt-4">
                  The trainer accepted your application and will contact you.
                </FeedbackBanner>
              )}

              {status === APPLICATION_STATUS.DECLINED && (
                <FeedbackBanner tone="info" className="mt-4">
                  The trainer did not accept this application. You can apply to other listings.
                </FeedbackBanner>
              )}
            </Card>
          );
        })}
      </div>
    );
  }

  return (
    <div className="text-left">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-h2 font-bold text-navy-500">My applications</h1>
        <Button to="/apprentice/listings" variant="outlined" size="sm">
          Browse listings
        </Button>
      </div>
      {content}
    </div>
  );
}