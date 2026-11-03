import { useWorkerReviews } from '@/lib/hooks/useReviews';
import ReviewCard from '@/features/trust/ReviewCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import ErrorState from '@/components/shared/ErrorState';

export default function MyReviews({ workerId }) {
  const { data: reviews = [], isLoading, isError, refetch } = useWorkerReviews(workerId);

  let content;
  if (!workerId) return null;
  if (isLoading) {
    content = <LoadingSpinner label="Loading reviews..." />;
  } else if (isError) {
    content = <ErrorState message="We could not load your reviews." onRetry={refetch} />;
  } else if (reviews.length === 0) {
    content = <p className="text-body2 text-navy-500/70">No reviews yet. They will show here after a job.</p>;
  } else {
    content = (
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  return (
    <section>
      <h2 className="mb-3 text-h3 font-bold text-navy-500">My reviews</h2>
      {content}
    </section>
  );
}