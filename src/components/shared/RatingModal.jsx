import { useState } from 'react';
import { Star } from 'lucide-react';
import { apiClient } from '@/lib/api/client';

export default function RatingModal({ isOpen, onClose, jobId, revieweeId, revieweeName }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await apiClient.post('/api/reviews', { jobId, revieweeId, rating, comment });
      alert('Review submitted successfully!');
      onClose();
    } catch (err) {
      alert('Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-2 text-gray-900">Rate {revieweeName}</h2>
        <p className="text-gray-500 text-sm mb-4">How was your experience working together?</p>

        <div className="flex justify-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button key={star} onClick={() => setRating(star)} className="focus:outline-none hover:scale-110 transition">
              <Star size={36} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
            </button>
          ))}
        </div>

        <textarea 
          placeholder="Leave a comment (optional)..." 
          maxLength={500}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4 h-24 resize-none focus:ring-teal-500"
        />

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
          <button 
            onClick={handleSubmit} 
            disabled={rating === 0 || isSubmitting}
            className="flex-1 bg-teal-600 text-white py-2 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}