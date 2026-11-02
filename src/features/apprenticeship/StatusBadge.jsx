import Chip from '@/components/ui/Chip';
import { APPLICATION_STATUS } from '@/lib/utils/constants';

const config = {
  [APPLICATION_STATUS.PENDING]: { tone: 'ochre', label: 'Pending' },
  [APPLICATION_STATUS.ACCEPTED]: { tone: 'success', label: 'Accepted' },
  [APPLICATION_STATUS.DECLINED]: { tone: 'danger', label: 'Declined' },
};

export default function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase();
  const { tone, label } = config[key] || { tone: 'neutral', label: status || 'Unknown' };

  return <Chip tone={tone}>{label}</Chip>;
}