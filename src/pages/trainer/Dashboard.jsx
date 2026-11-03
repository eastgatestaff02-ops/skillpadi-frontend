import { Plus, Users } from 'lucide-react';
import { useReceivedApplications, useUpdateApplicationStatus } from '@/lib/hooks/useApplications';
import { useMyListings } from '@/lib/hooks/useListings';
import { APPLICATION_STATUS } from '@/lib/utils/constants';
import { unwrapList } from '@/lib/utils/api';
import { getApiErrorMessage } from '@/lib/utils/errors';
import ApplicationCard from '@/features/trainer/ApplicationCard';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import FeedbackBanner from '@/components/ui/FeedbackBanner';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import ErrorState from '@/components/shared/ErrorState';

const isPending = (application) =>
  String(application.status || '').toLowerCase() === APPLICATION_STATUS.PENDING;

export default function TrainerDashboard() {
  const { data, isLoading, isError, refetch } = useReceivedApplications();
  const listingsQuery = useMyListings();
  const updateStatus = useUpdateApplicationStatus();

  const applications = [...unwrapList(data)].sort(
    (a, b) => Number(!isPending(a)) - Number(!isPending(b))
  );
  const pendingCount = applications.filter(isPending).length;
  const listings = unwrapList(listingsQuery.data);

  const newListingButton = (
    <Button to="/trainer/listings/new" leftIcon={Plus}>
      New listing
    </Button>
  );

  let applicantsContent;
  if (isLoading) {
    applicantsContent = <LoadingSpinner label="Loading applicants..." variant="list"/>;
  } else if (isError) {
    applicantsContent = (
      <ErrorState message="We could not load your applicants." onRetry={refetch} />
    );
  } else if (applications.length === 0) {
    applicantsContent = (
      <EmptyState
        icon={Users}
        title="No applicants yet"
        message="When apprentices apply to your listings, they will show up here."
        action={newListingButton}
      />
    );
  } else {
    applicantsContent = (
      <div className="space-y-4">
        {applications.map((application) => (
          <ApplicationCard
            key={application.id}
            application={application}
            onDecide={(id, status) => updateStatus.mutate({ id, status })}
            isUpdating={
              updateStatus.isPending && updateStatus.variables?.id === application.id
            }
          />
        ))}
      </div>
    );
  }

  let listingsContent;
  if (listingsQuery.isLoading) {
    listingsContent = <LoadingSpinner label="Loading listings..." />;
  } else if (listingsQuery.isError) {
    listingsContent = (
      <ErrorState message="We could not load your listings." onRetry={listingsQuery.refetch} />
    );
  } else if (listings.length === 0) {
    listingsContent = (
      <p className="text-body2 text-navy-500/70">You have not created any listings yet.</p>
    );
  } else {
    listingsContent = (
      <Card className="divide-y divide-navy-50 p-0">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="flex flex-wrap items-center justify-between gap-2 p-4 text-body2"
          >
            <span className="font-bold text-navy-500">
              {listing.trade?.name || listing.trade} apprenticeship
            </span>
            <span className="text-navy-500/70">
              {listing.location} · {listing.duration}
            </span>
          </div>
        ))}
      </Card>
    );
  }

  return (
    <div className="text-left">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h2 font-bold text-navy-500">Trainer dashboard</h1>
          {!isLoading && !isError && (
            <p className="mt-1 text-body2 text-navy-500/70">
              {pendingCount} {pendingCount === 1 ? 'application' : 'applications'} waiting for your
              decision
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Button to="/trainer/profile" variant="outlined">
            My profile
          </Button>
          {newListingButton}
        </div>
      </div>

      {updateStatus.isError && (
        <FeedbackBanner tone="error" className="mb-4">
          {getApiErrorMessage(updateStatus.error, 'Could not update the application.')}
        </FeedbackBanner>
      )}

      <h2 className="mb-3 text-h3 font-bold text-navy-500">Applicants</h2>
      {applicantsContent}

      <h2 className="mb-3 mt-10 text-h3 font-bold text-navy-500">My listings</h2>
      {listingsContent}
    </div>
  );
}