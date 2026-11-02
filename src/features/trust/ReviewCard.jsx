import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';
import { StarDisplay } from '@/components/ui/StarRating';

const formatDate = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
};

export default function ReviewCard({ review }) {
  const name =
    review.reviewer?.name || review.reviewerName || review.authorName || 'SkillPadi user';
  const comment = review.comment || review.text || review.review;
  const rating = Number(review.rating) || 0;
  const date = formatDate(review.createdAt);

  return (
    <Card>
      <div className="flex items-center gap-3">
        <Avatar name={name} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-body2 font-bold text-navy-500">{name}</p>
          <div className="flex items-center gap-2">
            <StarDisplay value={rating} size={14} />
            <span className="text-caption text-navy-500/70">{rating} of 5</span>
          </div>
        </div>
        {date && <span className="text-caption text-navy-500/60">{date}</span>}
      </div>
      {comment && <p className="mt-3 text-body2 text-navy-500">{comment}</p>}
    </Card>
  );
}