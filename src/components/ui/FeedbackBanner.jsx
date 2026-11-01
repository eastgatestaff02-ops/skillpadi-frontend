import { Info, CheckCircle2, AlertCircle, WifiOff } from 'lucide-react';

const tones = {
  info: {
    icon: Info,
    box: 'border-navy-100 bg-white',
    iconColor: 'text-navy-500',
  },
  success: {
    icon: CheckCircle2,
    box: 'border-success-200 bg-success-50',
    iconColor: 'text-success-500',
  },
  error: {
    icon: AlertCircle,
    box: 'border-danger-200 bg-danger-50',
    iconColor: 'text-danger-500',
  },
  offline: {
    icon: WifiOff,
    box: 'border-navy-100 bg-navy-50',
    iconColor: 'text-navy-500',
  },
};

export default function FeedbackBanner({ tone = 'info', action, className = '', children }) {
  const { icon: Icon, box, iconColor } = tones[tone];

  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-3 rounded-lg border p-3 ${box} ${className}`}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${iconColor}`} />
      <p className="flex-1 text-body2 text-navy-500">{children}</p>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}