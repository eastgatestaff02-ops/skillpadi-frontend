import logo from '@/assets/logo.jpeg';

const sizes = {
  sm: 'h-12 w-12',
  lg: 'h-28 w-28',
};

export default function Logo({ size = 'lg', className = '' }) {
  return (
    <span className={`block overflow-hidden ${sizes[size]} ${className}`}>
      <img
        src={logo}
        alt="SkillPadi"
        className="h-full w-full scale-[1.3] object-contain mix-blend-multiply"
      />
    </span>
  );
}