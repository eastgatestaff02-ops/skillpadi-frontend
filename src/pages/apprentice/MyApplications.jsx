import { Link } from 'react-router-dom';
import { MapPin, Clock, User, ClipboardList } from 'lucide-react';
import { useMyApplications } from '@/lib/hooks/useApplications';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import StatusBadge from '@/features/apprenticeship/StatusBadge';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const browseLink = (
  <Link
    to="/apprentice/listings"
    className="inline-block rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
  >
    Browse apprenticeships
  </Link>
);

export default function MyApplications() {
  const { data: applications, isLoading, isError, refetch } = useMyApplications();

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading your applications..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your applications." onRetry={refetch} />;
  } else if (!applications || applications.length === 0) {
    content = (
      <EmptyState
        icon={ClipboardList}
        title="No applications yet"
        message="Find an apprenticeship and apply. Your applications will show up here."
        action={browseLink}
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {applications.map((application) => (
          <div
            key={application.id}
            className="rounded-lg border border-gray-100 bg-white p-5 text-left shadow"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-lg font-bold text-gray-900">
                {application.listing
                  ? `${application.listing.trade} apprenticeship`
                  : 'Apprenticeship'}
              </h3>
              <StatusBadge status={application.status} />
            </div>

            {application.listing && (
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User size={14} /> {application.listing.trainerName}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={14} /> {application.listing.location}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} /> {application.listing.duration}
                </span>
              </div>
            )}

            <div className="mt-4 space-y-1 text-sm text-gray-700">
              <p>
                <span className="font-medium">Your availability: </span>
                {application.availability}
              </p>
              <p className="text-gray-500">
                Applied {new Date(application.createdAt).toLocaleDateString('en-NG')}
              </p>
            </div>

            {application.status === APPLICATION_STATUS.ACCEPTED && (
              <p className="mt-4 rounded bg-green-50 p-3 text-sm text-green-700">
                Congratulations. The trainer accepted your application and will contact you.
              </p>
            )}

            {application.status === APPLICATION_STATUS.DECLINED && (
              <p className="mt-4 rounded bg-gray-50 p-3 text-sm text-gray-600">
                The trainer did not accept this application. You can apply to other listings.
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 text-left md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">My Applications</h1>
        <Link
          to="/apprentice/listings"
          className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
        >
          Browse listings
        </Link>
      </div>

      {content}
    </div>
  );
}