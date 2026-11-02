import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useSubmitReview } from '@/lib/hooks/useReviews';
import { getApiErrorMessage } from '@/lib/utils/errors';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import TextAreaField from '@/components/ui/TextAreaField';
import FeedbackBanner from '@/components/ui/FeedbackBanner';

const MAX_LENGTH = 500;

function RatingForm({ jobId, revieweeId, revieweeName, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const submitReview = useSubmitReview();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || submitReview.isPending) return;
    submitReview.mutate({ jobId, revieweeId, rating, comment: comment.trim() });
  };

  if (submitReview.isSuccess) {
    return (
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-50">
          <CheckCircle2 size={28} className="text-success-500" />
        </span>
        <p className="mt-3 text-h3 font-bold text-navy-500">Review submitted</p>
        <p className="mt-1 text-body2 text-navy-500/70">
          Thank you for sharing your experience.
        </p>
        <Button fullWidth className="mt-6" onClick={onClose}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <p className="text-body2 text-navy-500/70">
        Share your experience working with {revieweeName}.
      </p>

      <div>
        <p className="mb-1.5 text-caption font-bold text-navy-500">How was your experience?</p>
        <StarRating value={rating} onChange={setRating} />
        <p className="mt-1.5 text-caption text-navy-500/70">
          Choose 1 to 5 stars. 1 is poor, 5 is excellent.
        </p>
      </div>

      <TextAreaField
        label="Written review (optional)"
        labelRight={`${comment.length}/${MAX_LENGTH}`}
        placeholder="What went well? What could improve?"
        helper="Keep your review honest and respectful."
        maxLength={MAX_LENGTH}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {submitReview.isError && (
        <FeedbackBanner tone="error">
          {getApiErrorMessage(submitReview.error, 'Could not submit your review. Please try again.')}
        </FeedbackBanner>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          fullWidth
          loading={submitReview.isPending}
          disabled={rating === 0}
        >
          Submit review
        </Button>
        <Button variant="outlined" fullWidth onClick={onClose} disabled={submitReview.isPending}>
          Maybe later
        </Button>
      </div>
    </form>
  );
}

export default function RatingModal({ isOpen, onClose, jobId, revieweeId, revieweeName }) {
  return (
    <Modal open={isOpen} onClose={onClose} title={`Rate ${revieweeName}`}>
      <RatingForm
        jobId={jobId}
        revieweeId={revieweeId}
        revieweeName={revieweeName}
        onClose={onClose}
      />
    </Modal>
  );
}