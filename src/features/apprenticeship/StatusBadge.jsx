import { APPLICATION_STATUS } from '@/lib/utils/constants';

const styles = {
  [APPLICATION_STATUS.PENDING]: 'bg-yellow-100 text-yellow-700',
  [APPLICATION_STATUS.ACCEPTED]: 'bg-green-100 text-green-700',
  [APPLICATION_STATUS.DECLINED]: 'bg-red-100 text-red-700',
};

const labels = {
  [APPLICATION_STATUS.PENDING]: 'Pending',
  [APPLICATION_STATUS.ACCEPTED]: 'Accepted',
  [APPLICATION_STATUS.DECLINED]: 'Declined',
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        styles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {labels[status] || status}
    </span>
  );
}