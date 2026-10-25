import { useState } from 'react';
import { Star } from 'lucide-react';
import { useSubmitReview } from '@/lib/hooks/useReviews';

export default function RatingModal({ isOpen, onClose, jobId, workerId, revieweeName }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const submitReview = useSubmitReview();

  if (!isOpen) return null;

  const handleSubmit = () => {
    submitReview.mutate({ jobId, workerId, rating, comment }, {
      onSuccess: () => {
        alert('Review submitted!');
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Rate {revieweeName}</h2>
        <p className="text-gray-500 text-sm mb-4">How was your experience?</p>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none">
              <Star size={32} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>

        {/* Comment */}
        <textarea 
          placeholder="Leave a comment (optional)..." 
          maxLength={500}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-2 rounded mb-4 h-24 resize-none"
        />

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={rating === 0 || submitReview.isPending}
            className="flex-1 bg-teal-600 text-white py-2 rounded disabled:opacity-50"
          >
            {submitReview.isPending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}