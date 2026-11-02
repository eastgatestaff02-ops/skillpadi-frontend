const tones = {
  neutral: 'bg-cream text-navy-500',
  ochre: 'bg-ochre-100 text-navy-500',
  success: 'bg-success-50 text-success-700',
  danger: 'bg-danger-50 text-danger-700',
};

export default function Chip({ tone = 'neutral', icon: Icon, className = '', children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-caption font-medium ${tones[tone]} ${className}`}
    >
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}