import Card from '@/components/ui/Card';

export default function CompletenessCard({ percent, tip, action }) {
  const complete = percent >= 100;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-body2 font-bold text-navy-500">Your profile</p>
        <p className="text-body2 font-bold text-navy-500">{percent}%</p>
      </div>

      <div
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        className="mt-2 h-2 overflow-hidden rounded-full bg-cream"
      >
        <div
          className={`h-full rounded-full transition-all ${
            complete ? 'bg-success-500' : 'bg-ochre-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <p className="mt-3 text-body2 text-navy-500/70">
        {complete ? 'Profile complete. Your work is ready to be seen.' : tip}
      </p>

      {action && <div className="mt-3">{action}</div>}
    </Card>
  );
}