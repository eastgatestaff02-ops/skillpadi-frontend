import Card from '@/components/ui/Card';

export default function MyReviews({ workerId }) {
  // The backend doesn't have a standalone /reviews endpoint.
  // Reviews should come attached to the profile object.
  // For now, we show a placeholder.

  return (
    <Card className="p-5 mt-4">
      <h2 className="text-h3 font-bold text-navy-500 mb-4">My Reviews</h2>
      <p className="text-sm text-navy-500/70">
        Your reviews from employers will appear here once you complete jobs.
      </p>
    </Card>
  );
}