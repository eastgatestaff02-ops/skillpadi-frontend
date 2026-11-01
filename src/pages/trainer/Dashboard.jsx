import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useReceivedApplications, useUpdateApplicationStatus } from '@/lib/hooks/useApplications';
import { useMyListings } from '@/lib/hooks/useListings';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import ApplicationCard from '@/features/trainer/ApplicationCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const newListingLink = (
  <Link
    to="/trainer/listings/new"
    className="inline-flex items-center gap-2 rounded bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
  >
    <Plus size={18} /> New listing
  </Link>
);

export default function TrainerDashboard() {
  const { data: applications, isLoading, isError, refetch } = useReceivedApplications();
  const {
    data: listings,
    isLoading: listingsLoading,
    isError: listingsError,
    refetch: refetchListings,
  } = useMyListings();
  const updateStatus = useUpdateApplicationStatus();

  const handleDecide = (id, status) => {
    updateStatus.mutate({ id, status });
  };

  const sorted = applications
    ? [...applications].sort((a, b) => {
        const aPending = a.status === APPLICATION_STATUS.PENDING ? 0 : 1;
        const bPending = b.status === APPLICATION_STATUS.PENDING ? 0 : 1;
        return aPending - bPending;
      })
    : [];

  const pendingCount = sorted.filter(
    (item) => item.status === APPLICATION_STATUS.PENDING
  ).length;

  let content;
  if (isLoading) {
    content = <LoadingSpinner label="Loading applicants..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your applicants." onRetry={refetch} />;
  } else if (sorted.length === 0) {
    content = (
      <EmptyState
        icon={Users}
        title="No applicants yet"
        message="When apprentices apply to your listings, they will show up here."
        action={newListingLink}
      />
    );
  } else {
    content = (
      <div className="space-y-4">
        {sorted.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onDecide={handleDecide}
            isUpdating={
              updateStatus.isPending && updateStatus.variables?.id === application.id
            }
          />
        ))}
      </div>
    );
  }

  let listingsContent;
  if (listingsLoading) {
    listingsContent = <p className="text-sm text-gray-500">Loading listings...</p>;
  } else if (listingsError) {
    listingsContent = (
      <ErrorState message="We could not load your listings." onRetry={refetchListings} />
    );
  } else if (!listings || listings.length === 0) {
    listingsContent = (
      <p className="text-sm italic text-gray-500">You have not created any listings yet.</p>
    );
  } else {
    listingsContent = (
      <ul className="space-y-2">
        {listings.map((listing) => (
          <li
            key={listing.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded border border-gray-100 bg-white px-4 py-3 text-sm shadow-sm"
          >
            <span className="font-medium text-gray-800">{listing.trade} apprenticeship</span>
            <span className="text-gray-500">
              {listing.location} - {listing.duration}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-4 text-left md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Trainer Dashboard</h1>
          {!isLoading && !isError && (
            <p className="mt-1 text-sm text-gray-500">
              {pendingCount} {pendingCount === 1 ? 'application' : 'applications'} waiting for your decision
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link
            to="/trainer/profile"
            className="rounded bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
          >
            My profile
          </Link>
          {newListingLink}
        </div>
      </div>

      {updateStatus.isError && (
        <p role="alert" className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">
          Could not update the application. Please try again.
        </p>
      )}

      <h2 className="mb-3 text-lg font-semibold">Applicants</h2>
      {content}

      <h2 className="mb-3 mt-10 text-lg font-semibold">My listings</h2>
      {listingsContent}
    </div>
  );
}